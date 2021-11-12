const Users = require("../Users/users-model");
const bcrypt = require("bcryptjs");

const validateBody = (req, res, next) => {
  const test = req.body;

  if (!test.password) {
    return res.status(401).json({ message: "username and password required" });
  }
  if (!test.username) {
    return res.status(401).json({ message: "username and password required" });
  }
  next();
};

const checkUserFree = async (req, res, next) => {
  const { username } = req.body;

  const [user] = await Users.getBy({ username });

  if (user) {
    return res.status(401).json({ message: "username taken" });
  }

  next();
};

const checkUserExists = async (req, res, next) => {
  const { username, password } = req.body;

  const [user] = await Users.getBy({ username });

  if (user && bcrypt.compareSync(password, user.password)) {
    next();
  } else {
    return res.status(401).json({ message: "invalid credentials" });
  }
};

module.exports = {
  validateBody,
  checkUserFree,
  checkUserExists
};
