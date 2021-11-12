const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { BCRYPT_ROUNDS } = require("./secrets");
// const tokenBuilder = require("./token-builder");
const {
  validateBody,
  checkUserFree,
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

router.post("/login", (req, res) => {
  res.end("implement login, please!");
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
