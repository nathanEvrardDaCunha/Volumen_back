import { NotFoundError } from '../../utils/errors/ClientError.js';
import {
    getUserById,
    setRefreshTokenToNull,
} from '../../models/user-models.js';
import { UserType } from '../../models/user-types.js';

type ClientUserType = Omit<
    UserType,
    'refresh_token' | 'updated_at' | 'id' | 'password_hash'
>;

export async function fetchUserService(
    tokenId: string
): Promise<ClientUserType> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    const { refresh_token, updated_at, id, password_hash, ...newUser } = user;

    return newUser;
}

export async function logoutService(refreshToken: string): Promise<void> {
    await setRefreshTokenToNull(refreshToken);
}
