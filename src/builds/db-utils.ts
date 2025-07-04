import APP from '../constants/app-constants.js';

export default function getSslConfig(): { rejectUnauthorized: false } | false {
    if (APP.app_env === 'production') {
        return { rejectUnauthorized: false };
    }
    return false;
}
