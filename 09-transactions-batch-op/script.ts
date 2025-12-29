import { prisma } from './lib/prisma';

async function main() {
	await prisma.user.createMany({
		data: [
			{ name: 'A', email: 'a@ex.com' },
			{ name: 'B', email: 'b@ex.com' },
			{ name: 'C', email: 'c@ex.com' },
		],
	});

	await prisma.$transaction(async (tx) => {
		await tx.comment.create({
			data: {
				text: 'Great Post',
				postId: 1,
				userId: 2,
			},
		});

		await tx.post.update({
			where: {
				id: 1,
			},
			data: {
				views: { increment: 1 },
			},
		});
	});
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
