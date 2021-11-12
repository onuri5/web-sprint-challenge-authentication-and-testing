const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { BCRYPT_ROUNDS } = require("./secrets");
const tokenBuilder = require("./token-builder");
const {
  validateBody,
  checkUserFree,
  checkUserExists,
} = require("../middleware/auth-middleware");
const Users = require("../Users/users-model");

router.post("/register", validateBody, checkUserFree, (req, res) => {
  let user = req.body;

  const rounds = BCRYPT_ROUNDS;
  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash;

  Users.add(user)
    .then((newUser) => {
      res.status(200).json(newUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});

router.post("/login", validateBody, checkUserExists, (req, res, next) => {
  let { username, password } = req.body;

  Users.getBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = tokenBuilder(user);
        res.status(200).json({
          message: `welcome, ${user.username}`,
          token,
        });
      }
    })
    .catch((err) => {
      next({ status: 500, message: err });
    });
});

module.exports = router;
