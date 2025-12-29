import { DefaultArgs } from '@prisma/client/runtime/client';
import { PrismaClient } from '../generated/prisma';
import { GlobalOmitConfig } from '../generated/prisma/internal/prismaNamespace';

export function softDeleteMiddleware(
	prisma: PrismaClient
): PrismaClient<never, GlobalOmitConfig | undefined, DefaultArgs> {
	return prisma.$extends({
		query: {
			user: {
				async findMany({ args, query }) {
					args.where = {
						...args.where,
						isDeleted: false,
					};
					return query(args);
				},
			},
		},
	});
}
