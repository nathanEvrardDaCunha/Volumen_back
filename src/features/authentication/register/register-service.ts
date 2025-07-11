import jwt from 'jsonwebtoken';
import JWT from '../../../constants/jwt-constants.js';
import {
    isUsernameUnavailable,
    isEmailUnavailable,
    createUser,
    getUserByEmail,
    setRefreshTokenByUserId,
} from '../../../models/user-models.js';
import {
    ConflictError,
    NotFoundError,
} from '../../../utils/errors/ClientError.js';
import { hashPassword } from '../utils.js';

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
}
