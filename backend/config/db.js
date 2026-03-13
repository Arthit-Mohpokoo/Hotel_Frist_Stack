const mysql = require("mysql2/promise");

const con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_ROOT_PASSWORD,
  database: process.env.DB_DATABASE,
});

// const mysql = require('mysql2')
// const conn = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_ROOT_PASSWORD,
//     database: process.env.DB_DATABASE,
// });


// conn.connect((err)=>{
//     if(err){
//         console.error("Data error U know")
//         return;
//     }
//     console.log("connection my Brother")
// });

module.exports = con;
