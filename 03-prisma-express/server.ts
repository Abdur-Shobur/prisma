import express from 'express';

const app = express();
app.use(express.json());

// connect prisma
// Start the server
// create user
import { prisma } from './lib/prisma';

// Create a new user endpoint
app.post('/users', async (req, res) => {
	const { name, email } = req.body;

	try {
		const exist = await prisma.user.findUnique({
			where: { email: email },
		});

		if (exist) {
			return res.send({ message: 'User Already Have!' });
		}

		const user = await prisma.user.create({
			data: { name, email },
		});
		res.status(201).json(user);
	} catch (error) {
		res.status(500).json({ error: 'Failed to create user' });
	}
});
app.get('/users/:id', async (req, res) => {
	try {
		console.log('Fire', req.params.id);
		const id = Number(req.params.id);
		const user = await prisma.user.findUnique({
			where: { id },
		});
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch user' });
	}
});

app.put('/users/:id', async (req, res) => {
	const id = Number(req.params.id);
	const { name, email } = req.body;
	try {
		const user = await prisma.user.update({
			where: { id },
			data: { name, email },
		});
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update user' });
	}
});

app.delete('/users/:id', async (req, res) => {
	try {
		const id = Number(req.params.id);
		const user = await prisma.user.delete({
			where: { id },
		});
		res.json({ message: 'user Delete', user });
	} catch (error) {
		console.log(error);
		res.status(404).json({ error: 'Not Found' });
	}
});

app.get('/users', async (req, res) => {
	const search = req.query.search; // ?search=abc

	const users = await prisma.user.findMany({
		skip: 0,
		take: 10,
		where: {
			name: {
				contains: search?.toString() || '',
				mode: 'insensitive',
			},
		},
	});
	res.json(users);
});

app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000');
});

// Home route
app.get('/', (req, res) => {
	res.send('🎉 Prisma + Express API Working!');
});
