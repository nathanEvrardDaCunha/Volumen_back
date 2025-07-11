import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const NodeMailerSchema = z
    .object({
        email_host: z.string().min(1),
        email_port: z.preprocess(
            (val) => parseInt(String(val), 10),
            z.number().min(1)
        ),
        email_user: z.string().min(1),
        email_password: z.string().min(1),
        email_from: z.string().min(1),
    })
    .readonly();

const { success, data, error } = NodeMailerSchema.safeParse({
    email_host: process.env.EMAIL_HOST,
    email_port: process.env.EMAIL_PORT,
    email_user: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASSWORD,
    email_from: process.env.EMAIL_FROM,
});

if (!success) {
    if (error instanceof z.ZodError) {
        console.error('❌ Invalid environment variables:\n', error.stack);
    } else {
        console.error('❌ Unexpected error during variables loading:\n', error);
    }
    process.exit(1);
}

console.log('Nodemailer environment variables loaded successfully.');

const MAILER = data;

export default MAILER;
