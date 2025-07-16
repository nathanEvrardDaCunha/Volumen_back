import pkg from 'pg';
import DB from './db-constants.js';
import getSslConfig from './db-utils.js';

const { Pool } = pkg;

const connectionOptions = {
    connectionString: DB.url,
    ssl: getSslConfig(),
};

export const pool = new Pool(connectionOptions);

pool.on('connect', (client) => {
    console.log(`Connection pool established with database.`);
});

pool.on('error', (err) => {
    console.error(`Unexpected error occurred on idle database client:`, err);
    process.exit(1);
});

export async function connectToDB(): Promise<void> {
    let client: pkg.PoolClient | undefined;
    try {
        client = await pool.connect();
        console.log('Connected to database successfully.');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    } finally {
        if (client) {
            client.release();
        }
    }
}

// TODO: Synchronize the constraint with the codebase (e.g: VARCHAR(${USERNAME_MAX_LENGTH}))

// TODO: replace the 'abstract-blue-orange.jpg' by AVATAR constant value

export async function initializeDB(): Promise<void> {
    let client: pkg.PoolClient | undefined;
    try {
        client = await pool.connect();

        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                avatar_id VARCHAR(50) NOT NULL DEFAULT 'abstract-blue-orange.jpg',
                bio TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                refresh_token VARCHAR(400) UNIQUE
            );
        `);

        // Check if there is something preventing me, thankfully, from creating multiple "Want to Read" shelve with the same user
        await client.query(`
            CREATE TABLE IF NOT EXISTS shelves (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id uuid NOT NULL,
                name VARCHAR(100) NOT NULL,
                is_public BOOLEAN NOT NULL DEFAULT FALSE,
                is_custom BOOLEAN NOT NULL DEFAULT FALSE, 
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_user
                    FOREIGN KEY (user_id) 
                        REFERENCES users(id)
                        ON DELETE CASCADE
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS books (
                id TEXT PRIMARY KEY,
                self_link TEXT,
                title TEXT,
                authors TEXT[],
                subtitle TEXT,
                description TEXT,
                publisher TEXT,
                published_date TEXT,
                industry_identifiers JSONB,
                page_count INTEGER,
                dimensions JSONB,
                maturity_rating TEXT,
                language TEXT,
                preview_link TEXT,
                info_link TEXT,
                canonical_volume_link TEXT,
                categories TEXT[],
                sale_country TEXT,
                saleability TEXT,
                is_ebook BOOLEAN,
                list_price JSONB,
                retail_price JSONB,
                buy_link TEXT
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS books_on_shelves (
                shelf_id uuid NOT NULL REFERENCES shelves(id) ON DELETE CASCADE,
                book_id VARCHAR(64) NOT NULL REFERENCES books(id) ON DELETE CASCADE,
                added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (shelf_id, book_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                book_id VARCHAR(64) NOT NULL REFERENCES books(id) ON DELETE CASCADE,
                review_text TEXT NOT NULL,
                is_spoiler BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, book_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS ratings (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                book_id VARCHAR(64) NOT NULL REFERENCES books(id) ON DELETE CASCADE,
                star_rating DECIMAL(2, 1) NOT NULL CHECK (star_rating BETWEEN 0.0 AND 5.0),
                pace VARCHAR(50),
                plot_vs_character VARCHAR(50),
                readability VARCHAR(50),
                character_depth VARCHAR(50),
                usefulness VARCHAR(50),
                info_density VARCHAR(50),
                emotional_impact VARCHAR(50),
                perfect_for VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, book_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS buddy_reads (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                book_id VARCHAR(64) NOT NULL REFERENCES books(id) ON DELETE CASCADE,
                created_by_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS buddy_read_participants (
                buddy_read_id uuid NOT NULL REFERENCES buddy_reads(id) ON DELETE CASCADE,
                user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
                joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (buddy_read_id, user_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS buddy_read_messages (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                buddy_read_id uuid NOT NULL REFERENCES buddy_reads(id) ON DELETE CASCADE,
                user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                message_text TEXT NOT NULL,
                progress_at_comment INTEGER NOT NULL CHECK (progress_at_comment BETWEEN 0 AND 100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } finally {
        if (client) {
            client.release();
        }
    }
}
