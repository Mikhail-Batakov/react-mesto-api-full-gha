const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'super_secret_key' } = process.env;

const chekToken = (token) => jwt.verify(token, JWT_SECRET);

const signToken = (user) => jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

module.exports = {
  chekToken,
  signToken,
};
