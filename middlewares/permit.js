const error = require("../error");

module.exports = roles => (req, res, next) => {

  const userRole = req.user && req.user.role;
  const found = roles.findIndex(role => role === userRole);
  return found !== -1 ? next() : next(error(403, "Access Denied"));
};
