import z from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    createUser,
    getUserByEmail,
    isEmailUnavailable,
    isUsernameUnavailable,
    setRefreshTokenByUserId,
} from '../../models/user-models.js';
import JWT from '../../constants/jwt-constants.js';
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
} from '../../utils/errors/ClientError.js';
import BCRYPT from './bcrypt-constants.js';

async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT);
}

// Should I use zod for condition like "if (usernameError)" instead of conditional ?

export async function registerService(
    username: unknown,
    email: unknown,
    password: unknown
): Promise<void> {
    // Does zod error bubble up by themselves ? => Test this when error middleware implemented

    // Should the zod schema be outside of the function ?

    const FormSchema = z.object({
        username: z.string().min(5),
        email: z.string().email(),
        password: z
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
    });
    type FormType = z.infer<typeof FormSchema>;

    const unknownForm = {
        username: username,
        email: email,
        password: password,
    };

    // Include try/catch like the other or the errors will bubble up ?
    let form: FormType;
    form = FormSchema.parse(unknownForm);

    const usernameError = await isUsernameUnavailable(form.username);
    if (usernameError) {
        throw new ConflictError('Username already exist in database.');
    }

    const emailError = await isEmailUnavailable(form.email);
    if (emailError) {
        throw new ConflictError('Email already exist in database.');
    }

    const hashedPassword = await hashPassword(form.password);

    await createUser(form.username, form.email, hashedPassword);

    const user = await getUserByEmail(form.email);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    const refreshToken = jwt.sign({ id: user.id }, JWT.refresh_token, {
        expiresIn: '14d',
    });

    await setRefreshTokenByUserId(refreshToken, user.id);

    // Verify refreshtoken is unique in db (equal to 1 result only) ?
}

export async function isPasswordMatch(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

// When login, verify the refresh token is still valid (or create a middleware for this)
export async function loginService(
    email: unknown,
    password: unknown
): Promise<{ refreshToken: string; accessToken: string }> {
    // Does zod error bubble up by themselves ? => Test this when error middleware implemented

    // Should the zod schema be outside of the function ?

    const FormSchema = z.object({
        email: z.string().email(),
        password: z
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
    });
    type FormType = z.infer<typeof FormSchema>;

    const unknownForm = {
        email: email,
        password: password,
    };

    // Include try/catch like the other or the errors will bubble up ?
    let form: FormType;
    form = FormSchema.parse(unknownForm);

    const user = await getUserByEmail(form.email);
    if (!user) {
        throw new NotFoundError('Invalid user credentials.');
    }

    const passwordMatch = await isPasswordMatch(
        form.password,
        user.password_hash
    );
    if (!passwordMatch) {
        throw new ForbiddenError('Invalid user credentials.');
    }

    const accessToken = jwt.sign({ id: user.id }, JWT.access_token, {
        expiresIn: '5m',
    });

    const refreshToken = jwt.sign({ id: user.id }, JWT.refresh_token, {
        expiresIn: '14d',
    });

    await setRefreshTokenByUserId(refreshToken, user.id);

    return {
        refreshToken: refreshToken,
        accessToken: accessToken,
    };
}
