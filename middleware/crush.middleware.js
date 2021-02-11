const ERROR = require('../dictionary/errors.dictionary');

const {
  CRUSH_SCHEME,
  validate,
  isValidToken,
} = require('../services/validator.service');

const addCrush = async (req, _res, next) => {
  try {
    const { body, headers } = await req;
    if (!headers.authorization) throw new Error(ERROR.NO_TOKEN);
    if (!isValidToken(headers)) throw new Error(ERROR.INVALID_TOKEN);
    validate(CRUSH_SCHEME)(body);
    const { name, age, date } = body;
    req.crush = { name, age, date };
    next();
  } catch ({ message }) {
    next({ message });
  }
};

module.exports = {
  addCrush,
};
