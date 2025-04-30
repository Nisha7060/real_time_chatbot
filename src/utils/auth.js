import jwt from 'jsonwebtoken'
const AUTH = process.env.AUTH_SECRET

export const VerifyToken = async (request) => {
    const authorizationHeader = request.headers.get('authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new Error('Invalid or missing authorization header');
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();
    if (!token) {
        throw new Error('Token is empty');
    }

    try {
        if (!AUTH) {
            throw new Error('AUTH_SECRET is not defined');
        }

        const verified = await jwt.verify(token, AUTH);
        const userId = verified.userId;

        if (!userId) {
            throw new Error('Unauthorized: User not found');
        }

        return verified;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Token verification failed: ' + error.message);
    }
};
