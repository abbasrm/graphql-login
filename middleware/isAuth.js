// For testing in postman
// { "query": "query { login(email: \"abbas@test.com\", password: \"123\") { _id token email}}"}
// { "query": "query { user(userId: \"5ccd9db9faf6bc10a8962877\") { _id email}}"}

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  req.isAuth = false;
  const header = req.header('Authorization');
  if (!header) return next();
  const token = header.split(' ')[1];
  if (!token || token === '') return next();
  try {
    const isAuth = await jwt.verify(token, process.env.JWT_SECRET);
    req.isAuth = true;
    req.userId = isAuth._id;
    req.email = isAuth.email;
    next();
  } catch (error) {
    next();
  }
};
