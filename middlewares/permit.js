// const error = require("../error");

// module.exports = roles => (req, res, next) => {

//   const userRole = req.user && req.user.role;
//   console.log(userRole, roles);
//   const found = roles.findIndex(role => role === userRole);
//   return found !== -1 ? next() : next(error(403, "Access Denied"));
// };

const error = require('../error');

module.exports = role => (req, res, next) => {
    if (req.user && req.user.role && req.user.role === role) return next();
    return next(error(403, "Access Denied"));
};