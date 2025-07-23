import { getUserById } from '../../../../models/users/users-models.js';
import { UserType } from '../../../../models/users/users-schemas.js';
import { NotFoundError } from '../../../../utils/errors/ClientError.js';

type ClientAvatarType = Omit<
    UserType,
    | 'refresh_token'
    | 'updated_at'
    | 'id'
    | 'password_hash'
    | 'username'
    | 'email'
    | 'bio'
    | 'created_at'
>;

export async function fetchAvatarService(
    tokenId: string
): Promise<ClientAvatarType> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    const {
        refresh_token,
        updated_at,
        id,
        password_hash,
        bio,
        username,
        email,
        created_at,
        ...newUser
    } = user;

    return newUser;
}
