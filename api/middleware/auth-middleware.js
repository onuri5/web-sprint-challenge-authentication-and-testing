const Users = require("../Users/users-model");

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

module.exports = {
  validateBody,
  checkUserFree,
};
