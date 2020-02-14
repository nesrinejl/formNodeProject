const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // to verify token is valid or not
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};