import bcrypt from 'bcrypt';
import BCRYPT from './bcrypt-constants.js';

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT);
}
