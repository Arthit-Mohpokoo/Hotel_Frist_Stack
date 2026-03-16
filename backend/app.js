const express = require("express")
const cors = require("cors")
const bodaypaser = require("body-parser")
const morgan = require("morgan")
require("dotenv").config(".env");
const {readdirSync} = require("fs")
const path = require("path")
const con = require("./config/db")

const app = express();
con;

app.use(cors());
app.use(bodaypaser.json({limit : '50mb', extended : true}))
app.use(morgan('dev'))
app.use("/upload", express.static(path.join(__dirname, "upload")));

readdirSync("./routes").map((r) =>{
    //  console.log("loading route:", r); 
    app.use("/api", require(`./routes/${r}`))
})

app.listen(process.env.PORT,()=>{
    console.log("Run Server On OK OK OK OK" )
})
