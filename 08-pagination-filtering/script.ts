import { prisma } from './lib/prisma';

async function main() {
	const page = 1;
	const limit = 10;
	const keyword = 'guide';

	const posts = await prisma.post.findMany({
		where: {
			title: {
				contains: keyword,
				mode: 'insensitive',
			},
		},
		orderBy: {
			id: 'desc',
		},
		skip: (page - 1) * limit,
		take: limit,
		include: {
			author: true,
			categories: true,
		},
	});
	console.log(posts);
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
