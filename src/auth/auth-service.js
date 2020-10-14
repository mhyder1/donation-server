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
      //ask for the one record and wont give that record unless it is auth. Determine if that password matches the one record in the database.
      .first();
      //if this AND that = && 
      //if authRow AND bcrypt compare, then login 
      //!! = bangbang; confirms that the boolean is true. If it is a false, it will fail and we wont be able to log in. 
      // First bang is a boolean and then it flips it back ????? That is converting to boolean 
      //Opposite of an object is false and then converts it back to a true. Authrow not equal to null. 
    
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
