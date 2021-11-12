const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
afterAll(async () => {
  await db.destroy();
});

test("sanity", () => {
  expect(true).toBe(true);
});

describe("Register Endpoint", () => {
  test("returns correct username and id in res", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "bob_dylan",
      password: "1234",
    });

    const { username, id } = res.body;

    expect(username).toBe("bob_dylan");
    expect(id).toBe(1);
  });

  test("password encrypted", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "bob_dylan",
      password: "1234",
    });

    expect(res.body.password).not.toBe("1234");
  });
});

describe("Login Endpoint", () => {
  test("returns correct message response on valid login", async () => {
    request(server).post("/api/auth/register").send({
      username: "bob_dylan",
      password: "1234",
    });

    const res = await request(server).post("/api/auth/login").send({
      username: "bob_dylan",
      password: "1234",
    });

    expect(res.body.message).toBe("welcome, bob_dylan");
  });

  describe("username and password validation", () => {
    test("Can't login with incorrect username", async () => {
      request(server).post("/api/auth/register").send({
        username: "bob_dylan",
        password: "12345",
      });

      const res = await request(server).post("/api/auth/login").send({
        username: "wrong",
        password: "1234",
      });

      expect(res.body.message).toBe("invalid credentials");
    });

    test("Can't login with incorrect password", async () => {
      request(server).post("/api/auth/register").send({
        username: "bob_dylan",
        password: "12345",
      });

      const res = await request(server).post("/api/auth/login").send({
        username: "bob_dylan",
        password: "wrong",
      });

      expect(res.body.message).toBe("invalid credentials");
    });
  });
});

describe("[GET] jokes", () => {
  test("returns correct message response on valid token", async () => {
    request(server).post("/api/auth/register").send({
      username: "bob_dylan",
      password: "1234",
    });

    const loginRes = await request(server).post("/api/auth/login").send({
      username: "bob_dylan",
      password: "1234",
    });

    const token = loginRes.body.token;

    const tokenGet = await request(server)
      .get("/api/jokes")
      .set("Authorization", token);

    expect(tokenGet.body).toHaveLength(3);
  });

  test("returns correct message response on invalid token", async () => {
    const tokenGet = await request(server)
      .get("/api/jokes")
      .set("Authorization", "wrong");

    expect(tokenGet.body).toMatchObject({ message: "token invalid" });
  });
});
