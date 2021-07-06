const dotenv = require('dotenv').config()

if (dotenv.error) throw dotenv.error;

module.exports = {
  host: process.env.DB_HOST_DOCKER,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}
