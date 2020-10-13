require('dotenv').config();

const { NODE_ENV, DB_URL, TEST_DB_URL } = process.env;

const connectionString = (NODE_ENV === 'test') ? TEST_DB_URL : DB_URL;

if(!connectionString || !connectionString.startsWith('postgresql:'))
  throw Error("Database not specified in current environment");

module.exports = {
  "migrationDirectory": "db.schema",
  "driver": "pg",
  connectionString,
};