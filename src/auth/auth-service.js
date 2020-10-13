const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const AuthService = {
  getUserWithUserName(db, username) {
    return db("user").where({ username }).first();
  },

  async loginUser(db, username, password) {
    const authRow = await db("user")
      .where({ username })
      .join("auth", "user.id", "auth.uid")
      .select("auth.data")
      .first();
    return !!authRow && bcrypt.compare(password, authRow.data);
  },

  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: "HS256",
    });
  },

  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  },
};

module.exports = AuthService;
