const express = require("express")
const cors = require("cors")
const bodaypaser = require("body-parser")
const morgan = require("morgan")
require("dotenv").config(".env");
const {readdirSync} = require("fs")
const con = require("./config/db")

const app = express();
con;

app.use(cors());
app.use(bodaypaser.json({limit : '50mb', extended : true}))
app.use(morgan('dev'))


readdirSync("./routes").map((r) =>{
    app.use("/api", require(`./routes/${r}`))
})

app.listen(process.env.PORT,()=>{
    console.log("Run Server On OK OK OK OK" )
})
