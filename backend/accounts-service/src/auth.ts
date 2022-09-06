import  bcrypt  from 'bcryptjs';
import  jwt, { VerifyOptions }     from 'jsonwebtoken';
import  fs      from 'fs';

const privateKey    = fs.readFileSync('./keys/private.key', 'utf8');
const publicKey     = fs.readFileSync('./keys/public.key', 'utf8');
const jwtExpires    = parseInt(`${process.env.JWT_EXPIRES}`);
const jwtalgorithm  = "RS256";

function hashPassword(password: string){
    return bcrypt.hashSync(password, 10);
}

function comparePassword(password: string, hashPassword: string){
    return bcrypt.compareSync(password, hashPassword);
}

type Token = {accountId: number };

function sign(accountId: number) {
    const token : Token = {accountId};
    return jwt.sign(token, privateKey, {expiresIn: jwtExpires, algorithm: jwtalgorithm });
}

async function verify(token: string){
    try{
        const decoded : Token = await jwt.verify(token, publicKey, {algorithm: [jwtalgorithm]} as VerifyOptions) as Token;
        return { accountId: decoded.accountId };
    }
    catch(error){
        console.log(`verify: ${error}`);
        return null;
    }
}

export default { hashPassword, comparePassword, sign, verify }