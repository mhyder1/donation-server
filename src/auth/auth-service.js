const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const authRouter = require("./auth-router");

const AuthService = {
  getUserWithUserName(db, username) {
    return db("user").where({ username }).first();
  },

  async loginUser(db, username, password) {
    try {
      const authRow = await db("user")
        .where({ username })
        .join("auth", "user.id", "auth.uid")
        .select("auth.data", "user.id", "user.label")
        .first();

      const success =
        !!authRow && (await bcrypt.compare(password, authRow.data));
      console.log(success);
      return success ? authRow : null;
    } catch (error) {
      throw error;
    }
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
