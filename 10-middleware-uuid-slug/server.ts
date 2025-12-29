import bcrypt from 'bcrypt';
import express from 'express';
import slugify from 'slugify';
import { Post, User } from './generated/prisma/client';
import { prisma } from './lib/prisma';
import { validateUser } from './validation/user';

const app = express();
app.use(express.json());

// login route
app.post('/login', async (req, res) => {
	const { email, password } = req.body as User;

	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (!user) return res.status(404).json({ error: 'User Not Found' });

	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.status(401).json({ error: 'Invalid Credential' });

	res.json({ message: 'Login Successful' });
});

// create user
app.post('/users', async (req, res) => {
	try {
		const data = validateUser(req.body);
		if (!data.data?.password) {
			return res.status(404).json({ error: 'Password Not found' });
		}
		const hashPassword = await bcrypt.hash(data.data?.password, 10);

		const user = await prisma.user.create({
			data: {
				email: data.data.email,
				password: hashPassword,
				name: data.data.name,
			},
		});

		res.json({ message: 'user created', user });
	} catch (error) {
		res.status(400).json({ error: 'User Not Create' });
	}
});

// soft delete

app.delete('/users/:id', async (req, res) => {
	const id = Number(req.params.id);

	try {
		const user = await prisma.user.update({
			where: { id },
			data: { isDeleted: true },
		});
		res.json({ message: 'User soft-deleted', user });
	} catch {
		res.status(404).json({ error: 'User not found' });
	}
});

// create post

app.post('/posts', async (req, res) => {
	const { title, content, userId } = req.body;

	try {
		const post = await prisma.post.create({
			data: {
				title,
				slug: slugify(title, { lower: true }),
				content,
				userId: Number(userId),
			},
		});
		res.json(post);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});
// get all posts
app.get('/posts', async (req, res) => {
	const posts = await prisma.post.findMany({
		include: {
			author: true,
		},
	});
	res.json(posts);
});

// get single post
app.get('/posts/:id', async (req, res) => {
	const id = Number(req.params.id);

	const post = await prisma.post.findUnique({
		where: {
			id,
		},
		include: { author: true },
	});
});

// update post
app.put('/posts/:id', async (req, res) => {
	const id = Number(req.params.id);
	const { title, content, published } = req.body as Post;
	try {
		const post = await prisma.post.update({
			where: { id },
			data: { title, content, published },
		});

		res.json(post);
	} catch (error) {
		res.status(400).json({ error: 'Post does not update!' });
	}
});

// delete post

app.delete('/posts/:id', async (req, res) => {
	const id = Number(req.params.id);

	try {
		const deleted = await prisma.post.delete({
			where: { id },
		});
		res.json({ message: 'Post Deleted', post: deleted });
	} catch (error) {
		res.status(400).json({
			message: 'Post Not Delete',
		});
	}
});

// user wise post fetch

app.get('/users/:id/post', async (req, res) => {
	const id = Number(req.params.id);

	const user = await prisma.user.findUnique({
		where: { id },
		include: {
			posts: true,
		},
	});
	user ? res.json(user) : res.status(404).json({ message: 'User Not found' });
});

// search Post

app.get('/search/post', async (req, res) => {
	const { search } = req.query;

	const posts = await prisma.post.findMany({
		where: {
			title: {
				contains: search?.toString(),
				mode: 'insensitive',
			},
		},
	});

	res.json(posts);
});
app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000');
});

// Home route
app.get('/', (req, res) => {
	res.send('  Prisma + Express API Working!');
});
