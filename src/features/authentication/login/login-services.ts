import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JWT from '../../../constants/jwt-constants.js';
import {
    getUserByEmail,
    setRefreshTokenByUserId,
} from '../../../models/users/users-models.js';
import {
    NotFoundError,
    ForbiddenError,
} from '../../../utils/errors/ClientError.js';

export async function isPasswordMatch(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

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
