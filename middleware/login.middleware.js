const {
  LOGIN_SCHEME,
  validate,
  generateToken,
} = require('../services/validator.service');

module.exports = async (req, _res, next) => {
  try {
    const { body } = await req;
    validate(LOGIN_SCHEME)(body);
    req.token = generateToken(body);
    next();
  } catch ({ message }) {
    next({ message });
  }
};
