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

        const user = UserSchema.parse(result.rows[0]);

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

        const user = UserSchema.parse(result.rows[0]);

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

export async function setRefreshTokenToNull(
    refreshToken: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            'UPDATE users SET refresh_token = $1 WHERE refresh_token = $2',
            [null, refreshToken]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function isUsernameTaken(username: string): Promise<boolean> {
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

export async function isEmailTaken(email: string): Promise<boolean> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
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

export async function setUsernameByUserId(
    id: string,
    username: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(`UPDATE users SET username = $1 WHERE id = $2`, [
            username,
            id,
        ]);
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function setEmailByUserId(
    id: string,
    email: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(`UPDATE users SET email = $1 WHERE id = $2`, [
            email,
            id,
        ]);
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function setPasswordByUserId(
    id: string,
    password: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`,
            [password, id]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function setBioByUserId(id: string, bio: string): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(`UPDATE users SET bio = $1 WHERE id = $2`, [
            bio,
            id,
        ]);
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function deleteUser(id: string): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(`DELETE FROM users WHERE id = $1`, [id]);
    } finally {
        if (client) {
            client.release();
        }
    }
}
