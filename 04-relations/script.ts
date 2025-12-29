import { prisma } from './lib/prisma';

async function main() {
	// Create a new user with a post
	const user = await prisma.user.create({
		data: {
			name: 'Alice',
			email: 'alice@prisma.io',
			posts: {
				create: {
					title: 'Hello World',
					content: 'This is my first post!',
					published: true,
				},
			},
		},
		include: {
			posts: true,
		},
	});
	// console.log('Created user:', user);

	// Fetch all users with their posts
	const allUsers = await prisma.user.findMany({
		include: {
			posts: true,
		},
	});

	// console.log(allUsers);

	// create post for existing user
	const postCreate = await prisma.post.create({
		data: {
			title: 'Test 1',
			published: false,
			authorId: 1,
			content: 'description',
		},
	});

	// console.log(postCreate);

	// only publish post
	const post = await prisma.post.findMany({
		where: {
			published: false,
		},
	});

	// console.log(post);

	const findUnique = await prisma.user.findUnique({
		where: {
			id: 1,
		},
		include: {
			posts: {
				where: {
					published: false,
				},
			},
		},
	});

	// console.log(findUnique);

	// pagination
	const pData = await prisma.user.findMany({
		include: {
			posts: {
				orderBy: { id: 'desc' },
				skip: 0,
				take: 5,
			},
		},
	});

	// console.log(pData);

	// publish update
	const pubUpdate = await prisma.post.update({
		where: {
			id: 2,
		},
		data: {
			published: true,
		},
	});

	console.log(pubUpdate);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
