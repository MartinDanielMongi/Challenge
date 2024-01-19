const config = require(__dirname + '/../config/config.json');
const mysql = require('mysql2/promise');

// MySQL pool of connections
let pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database,
  connectionLimit: config.mysql.connectionLimit
});

module.exports = pool;