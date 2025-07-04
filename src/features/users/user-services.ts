import z from 'zod';
import { NotFoundError } from '../../utils/errors/ClientError.js';
import { getUserById } from '../../models/user-models.js';
import { UserType } from '../../models/user-types.js';

type ClientUserType = Omit<
    UserType,
    'refresh_token' | 'updated_at' | 'id' | 'password_hash'
>;

export async function fetchUserService(
    tokenId: string | undefined
): Promise<ClientUserType> {
    // Does zod error bubble up by themselves ? => Test this when error middleware implemented
    // Should the zod schema be outside of the function ?
    // Is it normal that it's only 2 lines ? (no try /catch, no type...)
    // SHould I use safeParse or parse ?
    // Wouldn't it be better if instead of using 2 lines by creating a schema I put everything in one "const newRouteId = z.coerce.number().parse(routeId);" ?
    const TokenSchema = z.string();
    const newTokenId = TokenSchema.parse(tokenId);

    const user = await getUserById(newTokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    // Remove 'refreshToken' from result
    // Remove 'updatedAt' from result
    // Remove 'password_hash' from result
    // Remove 'id' from result

    const { refresh_token, updated_at, id, password_hash, ...newUser } = user;

    return newUser;
}
