import { setRefreshTokenToNull } from '../../../models/users/user-models.js';

export async function logoutService(refreshToken: string): Promise<void> {
    await setRefreshTokenToNull(refreshToken);
}
