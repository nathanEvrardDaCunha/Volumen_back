import {
    getUserById,
    isEmailTaken,
    isUsernameTaken,
    setBioByUserId,
    setEmailByUserId,
    setPasswordByUserId,
    setUsernameByUserId,
} from '../../../../models/users/user-models.js';
import {
    ConflictError,
    NotFoundError,
} from '../../../../utils/errors/ClientError.js';
import { hashPassword } from '../../../../utils/password/password-utils.js';

// Should I extract this and make it more global ?

export async function updateUserService(
    tokenId: string,
    username: string | undefined,
    email: string | undefined,
    password: string | undefined,
    bio: string | undefined
): Promise<void> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    if (
        username !== undefined &&
        username !== '' &&
        user.username !== username
    ) {
        const isTaken = await isUsernameTaken(username);
        if (isTaken) {
            throw new ConflictError('Username is already taken in database.');
        }
        await setUsernameByUserId(user.id, username);
    }

    if (email !== undefined && email !== '' && user.email !== email) {
        const isTaken = await isEmailTaken(email);
        if (isTaken) {
            throw new ConflictError('Email is already taken in database.');
        }
        await setEmailByUserId(user.id, email);
    }

    if (password !== undefined && password !== '') {
        const hashedPassword = await hashPassword(password);
        await setPasswordByUserId(user.id, hashedPassword);
    }

    if (bio !== undefined && bio !== '') {
        await setBioByUserId(user.id, bio);
    }
}
