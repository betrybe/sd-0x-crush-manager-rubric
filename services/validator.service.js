const Joi = require('@hapi/joi');
const { MD5 } = require('crypto-js');
const ERROR = require('../dictionary/errors.dictionary');

const MIN = 0;
const MAX = 16;
const MIN_NAME = 3;
const MIN_PASS = 6;
const MIN_RATE = 1;
const MAX_RATE = 5;
const MINOR = 18;
const DATED_LENGTH = 10;
const DATED_REGEX = /\d{2}\/\d{2}\/\d{4}/i;

const CRUSH_SCHEME = Joi.object({
  name: Joi.string().min(MIN_NAME).required().messages({
    'string.min': ERROR.INVALID_NAME,
    'any.required': ERROR.NO_NAME,
  }),
  age: Joi.number().min(MINOR).required().messages({
    'number.min': ERROR.INVALID_AGE,
    'any.required': ERROR.NO_AGE,
  }),
  date: Joi.object({ 
    datedAt: Joi.string().pattern(DATED_REGEX).min(DATED_LENGTH)
      .required()
      .messages({
        'string.pattern.base': ERROR.INVALID_DATE_AT,
        'string.min': ERROR.INVALID_DATE_AT,
        'any.required': ERROR.NO_DATE,
      }),
    rate: Joi.number().min(MIN_RATE).max(MAX_RATE)
      .required()
      .messages({
        'number.min': ERROR.INVALID_RATE,
        'number.max': ERROR.INVALID_RATE,
      }),
  }).required().messages({
    'any.required': ERROR.NO_DATE,
  }),
});

const LOGIN_SCHEME = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': ERROR.INVALID_EMAIL,
      'any.required': ERROR.NO_EMAIL,
    }),
  password: Joi.string().min(MIN_PASS).required()
    .messages({
      'string.min': ERROR.INVALID_PASS,
      'any.required': ERROR.NO_PASS,
    }),
});

const validate = (scheme) => (data) => {
  const { error } = scheme.validate(data);
  if (error) {
    const { message } = error.details[0];
    throw new Error(message);
  }
};

const generateToken = ({ email }) => MD5(email).toString().substr(MIN, MAX);
const isValidToken = ({ authorization }) => authorization.length === MAX;

module.exports = {
  CRUSH_SCHEME,
  LOGIN_SCHEME,
  validate,
  generateToken,
  isValidToken,
};
