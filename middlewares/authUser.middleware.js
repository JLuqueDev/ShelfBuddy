const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (!bearerHeader) {
            res.status(403).json({ error: 'Token missing' });
            console.log('Token missing');
            return;
        }
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
             res.status(401).json({ error: 'Invalid token'});
             console.log('Invalid token');
             return;
            }
            req.user = decoded;
            next();
        });
} catch (error) {
    console.log('authUser middleware error:', error.message);
    res.status(500).json({ msg: `Token invalido: `});
    return;
}}

module.exports = verifyToken;