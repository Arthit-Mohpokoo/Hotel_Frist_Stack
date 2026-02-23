const express = require("express");
const route = express.Router();
const {register, login,current} = require('../controllers/Auth');
const {authCheck,adminCheck} = require('../middleware/auth')

route.post("/SingUp",register)
route.post("/SingIn",login)
route.post("/current-user",authCheck,current)


module.exports = route;