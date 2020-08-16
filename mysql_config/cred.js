var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "gymUser",
  password: "EASYgymYoGuzA",
  database: "easygym",
  multipleStatements: true
});

module.exports = con;