import jwt from 'jsonwebtoken';

export function tokenize(payload: object){
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
}

export function verifyToken(token: string){
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (e) {
        return e;
    }
}