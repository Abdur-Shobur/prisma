import { prisma } from './prisma';

async function main() {
	// CREATE User
	// const user = await prisma.user.create({
	// 	data: {
	// 		name: 'Abdur Shobur 2',
	// 		email: 'shobur3@example.com',
	// 	},
	// });
	// console.log('User Created:', user);

	// READ All Users
	// Find all users that are not deleted
	const users = await prisma.user.findMany({
		where: { deleted: true },
	});
	console.log('All active users:', users);

	// const users = await prisma.user.findMany({
	// 	where: { name: { contains: 'Shobur' } },
	// 	skip: 0,
	// 	take: 10,
	// 	orderBy: { id: 'asc' },
	// });
	// console.log('All Users:', users);

	// soft delete user
	// const softDeletedUser = await prisma.user.update({
	// 	where: { id: 1 },
	// 	data: { deleted: true },
	// });
	// console.log('Soft Deleted:', softDeletedUser);

	// READ Single User with condition
	// const singleUser = await prisma.user.findUnique({
	// 	where: { email: 'shobur@example.com' },
	// });
	// console.log('Single User:', singleUser);

	// UPDATE User
	// const updatedUser = await prisma.user.update({
	// 	where: { id: user.id },
	// 	data: { name: 'Shobur Updated' },
	// });
	// console.log('Updated:', updatedUser);

	// DELETE User
	// const deletedUser = await prisma.user.delete({
	// 	where: { id: user.id },
	// });
	// console.log('Deleted:', deletedUser);
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
