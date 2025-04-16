import jwt from 'jsonwebtoken'
const AUTH = process.env.AUTH_SECRET

//<><><><><><><><><><><><><><><><><> DECODE TOKEN FOR GET USER_ID <><><><><><><><><><><><><><><><><><><><<>
export const VerifyToken = async (request) => {
    const authorizationHeader = request.headers.get('authorization');
    try {
        const token = authorizationHeader.slice('Bearer '.length);
        const verified = await jwt.verify(token, AUTH);
        const userId = verified.userId;

       

        if (userId===null) {
            throw new Error('Unauthorized: User not found');
        }
        return verified;
    } catch (error) {
        console.error('Error verifying token:', error); 
        throw new Error(error);
    }
};