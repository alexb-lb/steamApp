const mysql = require('mysql');
const mysqlConfig = require('../config/mysqlConfig');

class Database {
  constructor() {
    this.connection = mysql.createConnection(mysqlConfig);
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
}

module.exports = Database;