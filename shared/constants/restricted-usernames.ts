/**
 * Maps common homoglyphs and leetspeak characters to their base latin equivalents.
 * This is designed to catch 'dan1elmarch!' as 'danielmarchi'.
 */
const HOMOGLYPH_MAP: Record<string, string> = {
    '0': 'o',
    '1': 'i',
    '3': 'e',
    '4': 'a',
    '5': 's',
    '7': 't',
    '8': 'b',
    '9': 'g',
    '@': 'a',
    '!': 'i',
    '$': 's',
    '|': 'i',
}

const SKELETON_MAP: Record<string, string> = {
    // Leetspeak & Numbers
    '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '6': 'g', '7': 't', '8': 'b', '9': 'g',
    // Special Characters
    '@': 'a', '$': 's', '!': 'i', '|': 'i', '+': 't', '(': 'c', '[': 'c', '{': 'c',
    // Cyrillic Homoglyphs
    'а': 'a', 'е': 'e', 'і': 'i', 'ј': 'j', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x',
    // Greek Homoglyphs
    'α': 'a', 'ε': 'e', 'ι': 'i', 'ο': 'o', 'ρ': 'p', 'υ': 'y', 'χ': 'x',
};


/**
 * Generates a "Skeleton" of the username.
 * If two usernames have the same skeleton, they are visually too similar.
 */
export const generateUsernameSkeleton = (input: string): string => {
    // 1. Normalize Unicode (Compatibility Decomposition)
    // This handles characters like 'ⓔ' or 'é'
    const normalized = input.normalize('NFKD');

    return normalized
        .toLowerCase()
        .split('')
        .map((char) => {
            // 2. Remove non-spacing marks (accents/diacritics)
            if (char.match(/[\u0300-\u036f]/)) return '';

            // 3. Map visually similar characters to their base
            return SKELETON_MAP[char] || char;
        })
        .join('')
        // 4. Final sanitization: keep only base alphanumeric
        .replace(/[^a-z0-9]/g, '');
};


/**
 * Normalizes a string by:
 * 1. Converting to lowercase.
 * 2. Mapping homoglyphs/leetspeak to base characters.
 * 3. Removing all non-alphanumeric characters.
 */
export const normalizeUsername = (input: string): string => {
    return input
        .toLowerCase()
        .split('')
        .map((char) => HOMOGLYPH_MAP[char] || char)
        .join('')
        .replace(/[^a-z0-9]/g, '');
}

export const RESTRICTED_GROUPS = {
    BRAND: [
        'rimelight', 'rimelightent', 'rimelightentertainment', 'rimelightentmnt',
        'rlghtent', 'rlghtentertainment', 'rimelightstudio', 'rimelightgames',
        'rimelightteam', 'rimelightoffice', 'rimelightdev', 'rimelightstaff',
        'rimelightofficial', 'rimelightadmin', 'rimelightsupport', 'rimelight-official',
        'grandtale', 'grand-tale', 'grand_tale', 'grandtalegame', 'grandtaleofficial',
        'grandtalestaff', 'grandtalemod', 'playgrandtale', 'downloadgrandtale',
        'grandtale-dev', 'gt-staff', 'gt-official', 'gt-mod', 'gt-admin', 'gt-dev'
    ],
    FOUNDER: [
        'danielmarchi', 'daniel_marchi', 'daniel-marchi', 'daniel.marchi',
        'marchidaniel', 'dmarchi', 'ceo', 'founder', 'owner', 'danielm',
        'marchi', 'realmarchi', 'therealdaniel'
    ],
    STAFF_ROLES: [
        'admin', 'administrator', 'moderator', 'mod', 'staff', 'support', 'help',
        'official', 'verified', 'system', 'root', 'bot', 'security', 'community',
        'manager', 'dev', 'developer', 'designer', 'gamemaster', 'gm', 'assistant',
        'coordinator', 'representative', 'agent', 'supervisor', 'executive',
        'ambassador', 'expert', 'specialist', 'advocate', 'internal', 'employee',
        'associate', 'webmaster', 'sysop', 'operator', 'host', 'referee', 'council'
    ],
    LEGAL_FINANCIAL: [
        'checkout', 'subscribe', 'subscription', 'premium', 'vip', 'store', 'shop',
        'marketplace', 'wallet', 'refund', 'invoice', 'payout', 'rewards', 'prize',
        'giveaway', 'claims', 'verification', 'billing', 'payment', 'sales',
        'marketing', 'legal', 'compliance', 'privacy', 'tos', 'terms', 'copyright',
        'trademark', 'dmca', 'abuse', 'report'
    ],
    TECHNICAL: [
        'null', 'undefined', 'nan', 'none', 'everyone', 'all', 'guest', 'user',
        'test', 'tester', 'account', 'api', 'webhook', 'index', 'config', 'settings',
        'profile', 'auth', 'login', 'signup', 'signin', 'logout', 'signout',
        'localhost', 'ftp', 'smtp', 'pop3', 'imap', 'dns', 'proxy', 'cdn', 'static',
        'assets', 'media', 'upload', 'download', 'docs', 'manual', 'guide', 'tutorial',
        'error', '404', '500', 'maintenance', 'update', 'patch', 'changelog', 'status',
        'db', 'database', 'sql', 'query', 'health', 'ping', 'metrics', 'logs',
        'no-reply', 'noreply', 'donotreply', 'security-alert', 'mail', 'email', 'postmaster'
    ],
    LEETSPEAK: [
        '4dmin', '@dmin', 'st4ff', 'm0d', 'm0derator', '4dm1n', '4dmin1strator',
        'm0d3rator', 'st4f', '5upport', '0fficial', 'v3rified', '5ystem', 'r00t',
        'b0t', 's3curity', 'd3v', 'd3veloper', '@dministrator', 'adm1n', 'adm1nistrator'
    ]
} as const

export const RESTRICTED_USERNAMES = Object.values(RESTRICTED_GROUPS)
    .flat()
    .map(name => normalizeUsername(name))

export const RESTRICTED_SET = new Set(RESTRICTED_USERNAMES)