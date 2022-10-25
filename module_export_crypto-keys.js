const jose = require('jose');

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQDDVHJjO4NEI93b
8FWzLdGmXfhR1SpwZvqv3jjestneLCX9N9dIshADcauRoC27kE8ls4sr2n3+pWXM
wg9xN8YH1wJuMroC/Q0ngGY8nPMwLLHcrhxt7SQcWqmLNKMdLnuGXRDeRAC/IrJ8
GeeRvAekMA9V9G9IFBXZ6gcX8ZMP9nS/MIBjOUgevSZEMgCpcOXwJurn5/UFpa9m
z6zV6faUIlSNdGPqF3fa2iZOqfWNkV2g6CdRojFruNKdqB/nXRdzcjfORw9dWzrq
FR/6pdR80E6vBYlGAFa0Tataveca8LB1Pn88axtHBURHeVpxTozTkiNmy7Veu6Ny
o/gF8nBFAgMBAAECggEBALNia4a8kgnTEp45MstSKfaq2DF3HfmKaXF4GSxUfodu
bhkF3n2Roek3zEP6IeXeWwGZyRcmGo3xIfOQyRPGD+UFTeMcTP4PnbQIVFwYG7LD
aTjs4YkGvyIXFRuV5LMZDDJSZ/pn43OljtswAx4w26eqx3q9+DDu2T5+kbMolVGS
/1MxIJgUSMJknyHE5AtOWSljl3tywnEZyKv7xrGZOPUQktH17oHWwG4YRrlr11r6
6qsG2YPuecDCUn4ihgeet2TcFJaFdSbeRqv1nMgdspTUNtddKGGKQcBDikZLWX82
nzQGP1QeOPts7prm2izjeuSmlDKXpabeEJRaNi14n8UCgYEA608fqtirFLzWi+Iz
DZC1eYOttPLsiFuLLRKPz7TLwn2GDmZQP7Hd0KDNFU+LRLLArVw7e9NhFM6WIP6C
SVtADamFMtSSGnBBOi/6lYJLUpqNUZHZ4n+H7TIYH4r94uq7EYqb1C642bEVZL8X
1U9eQGH7xyhcYfBoK/utuQTdovsCgYEA1IFhJMkfp7+j3E4DZkLX7YqWs0D1syk8
rX5i10iZNseN5vnv3oy8MHJZtZioNopJ2TL2CfZct75BqoVSLvVFhaq5novmj7ga
Ld8lOgBCvq4KB0kgEPaDoIy/dNgEGxhEOachw0ibotmUUGtAa3BWx/zZufrU8oTi
EZ+fArsB1b8CgYEAtwn2ZSxjcB8weOF8uwmc0KgoYEAy1CL5kRcGPRizA1gnBl56
AAH4vIfI39HfUJIHpRLAxqJ3uvqz93himnNb0QTTsuV9vQkjBAM8Vj5jHx9P3Gqq
5TA06MJ111uEAJZ867k5XAT4D4ZbUOIAxRIXC9fsRVBVBG5Aai49RVXOni8CgYEA
vvzs5xfP2H8XcUe4LG9FC9vz53UpnfUg8LjXcq9v7Fjbg0z8taL8+/m6AMkL3cDZ
8Fip4nhGCmn3MJ+UJloQOrsfCoyoEmEfPj0Agyl6008t+jBRno0/7cqxw/zla8ia
gMpiQNX/8xPkBYbvJeCYTjNFJ651NuYRHE++pMCYPJcCgYEAgdSiXxw1yUyn9XgQ
Pk8mhSLxkNHZgI+/SzA0ikY9Ajmcpc/iu91kDsNpZzDi5reFs0AjJf+vNowO9n7P
ELpgN5HDg2kapRczYDUfXLzyff/E9ObyodH9FaDJJ4Eg7I7MeLI4iKz0Kcpxmk+n
MTW4EJIEUbqyIUnTN5bMZ8PI8ao=
-----END PRIVATE KEY-----`;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw1RyYzuDRCPd2/BVsy3R
pl34UdUqcGb6r9443rLZ3iwl/TfXSLIQA3GrkaAtu5BPJbOLK9p9/qVlzMIPcTfG
B9cCbjK6Av0NJ4BmPJzzMCyx3K4cbe0kHFqpizSjHS57hl0Q3kQAvyKyfBnnkbwH
pDAPVfRvSBQV2eoHF/GTD/Z0vzCAYzlIHr0mRDIAqXDl8Cbq5+f1BaWvZs+s1en2
lCJUjXRj6hd32tomTqn1jZFdoOgnUaIxa7jSnagf510Xc3I3zkcPXVs66hUf+qXU
fNBOrwWJRgBWtE2rWr3nGvCwdT5/PGsbRwVER3lacU6M05IjZsu1XrujcqP4BfJw
RQIDAQAB
-----END PUBLIC KEY-----`;

async function generateToken(payload){
    try{
        const jwt = new jose.SignJWT(payload);
        const private_key = await jose.importPKCS8(privateKey);
        jwt.setExpirationTime('24h');
        jwt.setProtectedHeader({ alg:"RS512" });
        var access_token = await jwt.sign(private_key);
    }catch(err){
        console.log(err);
    }finally{
        return access_token;
    } 
}

async function verifyToken(token){
    try{
        const public_key = await jose.importSPKI(publicKey);
        var is_valid = await jose.jwtVerify(token,public_key);
    }catch(err){
        return err;
    }finally{
        return is_valid;
    }
}

module.exports = { generateToken, verifyToken };