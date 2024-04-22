var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.use(cors())

const mysql = require('mysql2');
// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'node_login',
  });
/* รับข้อมูลจากผู้ใช้ แบบติดhashที่รหัสPassword*/
app.post('/register',jsonParser, function (req, res, next) {
  connection.execute(
 'INSERT INTO user (USERNAME,NAME,LASTNAME,EMAIL,PASSWORD) VALUES (?,?,?,?,?)',
            [req.body.USERNAME,req.body.NAME,req.body.LASTNAME,req.body.EMAIL,req.body.PASSWORD],
            function (err, results, fields) {
              if (err){
                res.json({status: 'error', massage: err})
                return
              }
              res.json({status: 'ok'})
            }
         
          );
    });
    app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})