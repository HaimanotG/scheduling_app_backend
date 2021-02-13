const jwt = require('jsonwebtoken');
const error = require('../error');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) return next(error(400, "Token Not Proided"));

        // const token = bearer.split(' ')[1];
        const user = await jwt.verify(token, process.env.SECRET);

        if (!user) return next(error("Error in decoding token"));
        req.user = user;
        next();
    } catch (e) {
        return next(error(e.message));
    }
};