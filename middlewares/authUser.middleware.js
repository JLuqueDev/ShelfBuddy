const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const headerAuth = req.header('authorization');

        // to check the header exisits before splitting:
        if (!headerAuth) {
            res.status(403).json({ error: 'Token missing, access denied' });
            console.log('Token missing, access denied');
            return;
        }
        // to prevent the "Cannot read properties of undefined (reading 'split') crash" we saw in class:
        const parts = headerAuth.split(' ');
        const token = parts[1];

        // in case header format is sent empty or malformed:
        if (parts[0] !== 'Bearer' || !token) {
            console.log('Invalid token format. Must be: Bearer <token>');
            return res.status(401).json({ msg: 'Invalid token format. Must be: Bearer <token>'});
        } 
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('Decoded successfully:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(`Invalid or expired token: ${error.message}`);
        res.status(401).json({ msg: `Invalid or expired token: ${error.message}`});
        return;
    }
};

module.exports = verifyToken;