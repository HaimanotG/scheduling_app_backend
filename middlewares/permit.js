const error = require('../error');

module.exports = role => (req, res, next) => {
    if (req.user.role && req.user.role === role) return next();
    return next(error(403, "Access Denied"));
};