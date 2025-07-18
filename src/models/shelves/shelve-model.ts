import { PoolClient } from 'pg';
import { pool } from '../../builds/db.js';
import { ShelveSchema, ShelveType } from './shelves-schemas.js';

export async function createShelveByUserId(
    userId: string,
    name: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO shelves (name, user_id) VALUES ($1, $2)`,
            [name, userId]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function createCustomShelveByUserId(
    userId: string,
    name: string
): Promise<void> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query(
            `INSERT INTO shelves (name, user_id, is_custom) VALUES ($1, $2, $3)`,
            [name, userId, true]
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function getShelveByUserId(
    userId: string,
    name: string
): Promise<ShelveType | false> {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();

        const result = await client.query(
            `SELECT 
                id, 
                user_id, 
                name, 
                is_public, 
                is_custom, 
                created_at, 
                updated_at 
            FROM shelves 
            WHERE user_id = $1 AND name = $2`,
            [userId, name]
        );

        if (result.rows.length === 0) {
            return false;
        }

        const row = result.rows[0];

        const shelveData = {
            id: row.id,
            userId: row.user_id,
            name: row.name,
            isPublic: row.is_public,
            isCustom: row.is_custom,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };

        const shelve = ShelveSchema.parse(shelveData);

        return shelve;
    } finally {
        if (client) {
            client.release();
        }
    }
}
