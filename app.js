var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt')
const saltRounds = 10
var jwt = require('jsonwebtoken')
const secret = 'Fullstack-Login-2023'

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
    bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
        connection.execute(
            'INSERT INTO register (User_ID,Username,Name,Lastname,Birthdate,Age,Grade,Email,Password) VALUES (?,?,?,?,?,?,?,?,?)',
            [req.body.User_ID,req.body.Username,req.body.Name,req.body.Lastname,req.body.Birthdate,req.body.Age,req.body.Grade,req.body.Email,hash],
            function (err, results, fields) {
              if (err){
                res.json({status: 'error', massage: err})
                return
              }
              res.json({status: 'ok'})
            }
          );
      
    });
    /* ตรวจสอบความยาวของregister Password  และ Email ถูกต้องหรือไม่ ยืนยันตัวตนเข้าระบบ*/
})
app.post('/login',jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM register WHERE Email=?',
        [req.body.Email],
        function (err, register, fields) {
          if (err){res.json({status: 'error', massage: err}); return}
          if (register.length == 0){res.json({status: 'error', massage: 'no user found'}); return}
          bcrypt.compare(req.body.Password, register[0].Password, function(err, isLogin) {
            if (isLogin){
                var token = jwt.sign({ Email: register[0].Email }, secret, { expiresIn: '1h' });
                res.json({status: 'ok', message: 'login success',token})
            }else {
                res.json({status: 'error', message: 'login failed'})
            }
        });
          
        }
      );
  
})
app.post('/authen',jsonParser, function (req, res, next) {
    try{
        const token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, secret)
        res.json({status: 'ok',decoded})
    } catch(err){
        res.json({status: 'error', message: err.message})
    }
   
})

app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})