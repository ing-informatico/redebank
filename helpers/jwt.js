const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
    
        return new Promise((resolve, reject) => {
    
            const payload = { uid };
    
            jwt.sign(payload, process.env.SECRET_JWT_SEED, {
                expiresIn: '24h'
            }, (err, token) => {
                if (err) {
                    reject(new Error('No se pudo generar el JWT'));
                } else {
                    resolve(token);
                }
            });
    
        });
}



module.exports = {
    generarJWT
}