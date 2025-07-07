import jwt from 'jsonwebtoken';
import { z } from 'zod';
import JWT from '../../constants/jwt-constants.js';
import {
    NotFoundError,
    UnauthorizedError,
} from '../../utils/errors/ClientError.js';
import { getUserById } from '../../models/user-models.js';

const DecodedPayloadSchema = z.object({
    id: z.string(),
});

export async function refreshTokenService(
    refreshToken: string
): Promise<string> {
    let decoded: string | jwt.JwtPayload;
    try {
        decoded = jwt.verify(refreshToken, JWT.refresh_token);
    } catch (error) {
        throw new UnauthorizedError(
            'User token has expired and need to sign-in again !'
        );
    }

    const validationResult = DecodedPayloadSchema.parse(decoded);

    const user = await getUserById(validationResult.id.toString());
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    const accessToken = jwt.sign({ id: user.id }, JWT.access_token, {
        expiresIn: '1m',
    });

    return accessToken;
}
