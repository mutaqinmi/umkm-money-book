import jwt from 'jsonwebtoken';

export function tokenize(payload: object){
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
}

export function verifyToken(token: string){
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET as string);
        
        if(verify) return true;
    } catch (e) {
        return false;
    }
}