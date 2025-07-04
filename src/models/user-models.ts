import { PoolClient } from 'pg';
import { pool } from '../builds/db.js';
import { UserSchema, UserType } from './user-types.js';

// Don't forget to format the data when necessary.

export async function isUsernameUnavailable(
    username: string
): Promise<boolean> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        const result = await client.query(
            `SELECT username FROM users WHERE username=$1`,
            [username]
        );
        return result.rows.length > 0;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function isEmailUnavailable(email: string): Promise<boolean> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();

        // Make the result unknown instead of any ?

        const result = await client.query(
            `SELECT email FROM users WHERE email=$1`,
            [email]
        );
        return result.rows.length > 0;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function createUser(
    username: string,
    email: string,
    hashedPassword: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)`,
            [username, email, hashedPassword]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function getUserByEmail(email: string): Promise<UserType | false> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();

        const result = await client.query(
            'SELECT id, username, email, password_hash, avatar_id, bio, created_at, updated_at, refresh_token FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return false;
        }

        if (result.rows[0].length === 0) {
            return false;
        }

        const unknownUser = {
            id: result.rows[0].id as unknown,
            username: result.rows[0].username as unknown,
            email: result.rows[0].email as unknown,
            password_hash: result.rows[0].password_hash as unknown,
            avatar_id: result.rows[0].avatar_id as unknown,
            bio: result.rows[0].bio as unknown,
            created_at: result.rows[0].created_at as unknown,
            updated_at: result.rows[0].updated_at as unknown,
            refresh_token: result.rows[0].refresh_token as unknown,
        };

        const user = UserSchema.parse(unknownUser);

        return user;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function getUserById(id: string): Promise<UserType | false> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();

        const result = await client.query(
            'SELECT id, username, email, password_hash, avatar_id, bio, created_at, updated_at, refresh_token FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return false;
        }

        if (result.rows[0].length === 0) {
            return false;
        }

        const unknownUser = {
            id: result.rows[0].id as unknown,
            username: result.rows[0].username as unknown,
            email: result.rows[0].email as unknown,
            password_hash: result.rows[0].password_hash as unknown,
            avatar_id: result.rows[0].avatar_id as unknown,
            bio: result.rows[0].bio as unknown,
            created_at: result.rows[0].created_at as unknown,
            updated_at: result.rows[0].updated_at as unknown,
            refresh_token: result.rows[0].refresh_token as unknown,
        };

        const user = UserSchema.parse(unknownUser);

        return user;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function setRefreshTokenByUserId(
    refreshToken: string,
    id: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `UPDATE users SET refresh_token = $1 WHERE id = $2`,
            [refreshToken, id]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}
