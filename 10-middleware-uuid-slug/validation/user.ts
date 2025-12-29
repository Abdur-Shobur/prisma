import { z } from 'zod';

export const userSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type User = z.infer<typeof userSchema>;

export const validateUser = (user: User) => {
	return userSchema.safeParse(user);
};
