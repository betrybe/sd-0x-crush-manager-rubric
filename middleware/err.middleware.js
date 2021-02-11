const ERROR = 400;

module.exports = (_err, _req, res, _next) => {
  const { message: m } = _err;
  res
    .status(m.split(';')[1] || ERROR)
    .json({ message: m.split(';')[0] });
};
