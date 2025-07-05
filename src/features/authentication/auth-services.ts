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
    username: string,
    email: string,
    password: string
): Promise<void> {
    const usernameError = await isUsernameUnavailable(username);
    if (usernameError) {
        throw new ConflictError('Username already exist in database.');
    }

    const emailError = await isEmailUnavailable(email);
    if (emailError) {
        throw new ConflictError('Email already exist in database.');
    }

    const hashedPassword = await hashPassword(password);

    await createUser(username, email, hashedPassword);

    const user = await getUserByEmail(email);
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
    email: string,
    password: string
): Promise<{ refreshToken: string; accessToken: string }> {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new NotFoundError('Invalid user credentials.');
    }

    const passwordMatch = await isPasswordMatch(password, user.password_hash);
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
