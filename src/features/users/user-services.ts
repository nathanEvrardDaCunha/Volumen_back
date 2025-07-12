import {
    ConflictError,
    NotFoundError,
} from '../../utils/errors/ClientError.js';
import {
    deleteUser,
    getUserById,
    isEmailTaken,
    isUsernameTaken,
    setAvatarByUserId,
    setBioByUserId,
    setEmailByUserId,
    setPasswordByUserId,
    setRefreshTokenToNull,
    setUsernameByUserId,
} from '../../models/user-models.js';
import { UserType } from '../../models/user-types.js';
import BCRYPT from '../authentication/bcrypt-constants.js';
import bcrypt from 'bcrypt';
import { UpdateAvatarType } from './user-controllers.js';

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

export async function logoutService(refreshToken: string): Promise<void> {
    await setRefreshTokenToNull(refreshToken);
}

async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT);
}

export async function updateAvatarService(
    tokenId: string,
    avatar_id: string
): Promise<void> {
    const user = await getUserById(tokenId);
    if (!user) {
        throw new NotFoundError('User has not been found in database.');
    }

    await setAvatarByUserId(user.id, avatar_id);
}

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

export async function deleteUserService(userId: string): Promise<void> {
    const user = await getUserById(userId);
    if (!user) {
        throw new NotFoundError('User has not been found in database !');
    }

    await deleteUser(user.id);
}
