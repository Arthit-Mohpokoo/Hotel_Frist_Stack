const express = require("express");
const { Rlist,Rcreate,Rread,Rremove} = require("../controllers/rooms");
const { upload} = require("../middleware/upload");
const { validateRoom } = require("../middleware/rooms");

const route = express.Router();

// route.post('/hotel/rooms', upload.single("images",5), Rcreate);
route.post('/hotel/rooms', upload.array("images",5), Rcreate);
route.delete('/hotel/rooms/:id',Rremove)
route.get('/hotel/:idhotel/rooms',Rlist)
route.get('/hotel/rooms/:idhotel/:id',Rread)


module.exports = route;