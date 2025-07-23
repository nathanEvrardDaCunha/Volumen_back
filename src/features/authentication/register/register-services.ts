import jwt from 'jsonwebtoken';
import JWT from '../../../constants/jwt-constants.js';
import {
    isUsernameUnavailable,
    isEmailUnavailable,
    createUser,
    getUserByEmail,
    setRefreshTokenByUserId,
} from '../../../models/users/users-models.js';
import {
    ConflictError,
    NotFoundError,
} from '../../../utils/errors/ClientError.js';
import { hashPassword } from '../../../utils/password/password-utils.js';
import { createShelveByUserId } from '../../../models/shelves/shelves-models.js';

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

    await createShelveByUserId(user.id, 'Want to Read');
    await createShelveByUserId(user.id, 'Currently Reading');
    await createShelveByUserId(user.id, 'Read');
    await createShelveByUserId(user.id, 'Did not Finish');

    const refreshToken = jwt.sign({ id: user.id }, JWT.refresh_token, {
        expiresIn: '14d',
    });

    await setRefreshTokenByUserId(refreshToken, user.id);
}
