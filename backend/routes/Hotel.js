const express = require("express");
const route = express.Router();
const {list,read,create ,edit,remove} = require("../controllers/Hotel");
const { authCheck } = require("../middleware/auth");


route.get("/hotel",list)
route.get("/hotel/:id",read)
route.post("/hotel",create)
route.put("/hotel/:id",authCheck,edit)
route.delete("/hotel/:id",authCheck,remove)


module.exports = route;