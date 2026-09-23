const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerheader = req.headers['authorization'];
    if (!bearerheader) {
        return res.status(403).json({
            error: 'Token missing'
        });
    }
    const token = bearerheader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                error: 'Invalid token'
            });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;