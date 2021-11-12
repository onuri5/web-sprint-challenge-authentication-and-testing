const { TOKEN_SECRET } = require("../auth/secrets"); // use this secret!
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "token required" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "token invalid" });
    }

    req.decodedJwt = decoded;
    next();
  });
};
