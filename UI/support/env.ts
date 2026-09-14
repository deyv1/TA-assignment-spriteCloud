function requireEnvironment(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const ENV = {
    baseUrl: requireEnvironment('BASE_URL_UI'),
    standardUser: {
        username: 'standard_user',
        password: requireEnvironment('STANDARD_PASSWORD'),
    },
    lockedOutUser: {
        username: 'locked_out_user',
        password: requireEnvironment('LOCKED_OUT_PASSWORD'),
    }
};