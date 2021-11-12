const db = require("../../data/dbConfig");

function getUsers() {
  return db("users");
}

function getBy(filter) {
  return db("users").where(filter);
}

async function add(user) {
  const [id] = await db("users").insert(user);
  return db("users").where("id", id).first();
}

module.exports = {
  add,
  getUsers,
  getBy
};
