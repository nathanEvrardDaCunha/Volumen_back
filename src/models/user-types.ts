import z from 'zod';

export const UserSchema = z.object({
    id: z.string().uuid(),
    username: z.string().min(5),
    email: z.string().email(),
    password_hash: z
        .string()
        .min(8)
        .refine((password) => /[A-Z]/.test(password), {
            message: 'Password must contain at least one uppercase letter',
        })
        .refine((password) => /[a-z]/.test(password), {
            message: 'Password must contain at least one lowercase letter',
        })
        .refine((password) => /[0-9]/.test(password), {
            message: 'Password must contain at least one number',
        })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: 'Password must contain at least one special character',
        }),
    avatar_id: z.string().min(5),
    bio: z.string().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
    refresh_token: z.string().nullable(),
});
export type UserType = z.infer<typeof UserSchema>;
