import express from 'express';
import { Post } from './generated/prisma/client';
import { prisma } from './lib/prisma';

const app = express();
app.use(express.json());

// create post
app.post('/posts', async (req, res) => {
	const { content, authorId, published, title } = req.body as Post;

	try {
		const post = await prisma.post.create({
			data: { title, authorId, content, published },
		});

		res.json(post);
	} catch (error) {
		res.status(400).json({ error: 'post does not create!' });
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
