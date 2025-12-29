import slugify from 'slugify';
import { prisma } from './lib/prisma';

async function main() {
	// Logging Middleware
	prisma.$use(async (params, next) => {
		const before = Date.now();
		const result = await next(params);
		const after = Date.now();

		console.log(
			`[Prisma] ${params.model}.${params.action} took ${after - before}ms`
		);
		return result;
	});

	// Soft Delete Middleware
	prisma.$use(async (params, next) => {
		if (params.model === 'Post' && params.action === 'findMany') {
			if (!params.args.where) params.args.where = {};
			params.args.where.deleted = false;
		}
		return next(params);
	});

	prisma.$use(async (params, next) => {
		if (params.model === 'Post' && params.action === 'create') {
			if (params.args.data.title) {
				params.args.data.slug = slugify(params.args.data.title, {
					lower: true,
				});
			}
		}
		return next(params);
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
