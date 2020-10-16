const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UserService = {
  hasUserWithUserName(db, username) {
    return db("user")
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  insertUser(db, newUser) {
    const { username, password, label } = newUser;
    return db.transaction(async (transaction) => {
      const user = await transaction
        .insert({ username, label })
        .into("user")
        .returning("*")
        .then(([user]) => user);
      await transaction
        .insert({ data: password, method: 1, label, uid: user.id })
        .into("auth");
      return user;
    });
  },
  validatePassword(password) {
    if (password.length < 8 || password.length > 20) {
      return "Password must be betwwen 8 and 20 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain one upper case, lower case, number and special character";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      label: user.label,
      username: user.username,
    };
  },
};

module.exports = UserService;
