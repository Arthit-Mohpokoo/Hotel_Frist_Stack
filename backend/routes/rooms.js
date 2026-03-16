const express = require("express");
const { Rlist,Rcreate,Rread,Rremove,Redit, Imadd,Iremove, checkroom, Rreadlist, Iread} = require("../controllers/rooms");
const { upload} = require("../middleware/upload");
const { authCheck } = require("../middleware/auth");
const route = express.Router();

route.post('/hotel/rooms',authCheck, upload.array("images",5), Rcreate);
route.post('/hotel/rooms/Delete',authCheck,Rremove)
route.get('/hotel/:idhotel/rooms',Rlist)
route.get('/hotel/rooms/:idhotel/all', Rread)  
route.get('/hotel/rooms/:idhotel/:id',  Rread)
route.put('/hotel/rooms/:id',authCheck,upload.array("images",5),Redit)
route.post('/roomcheck',checkroom)
route.post('/listto',Rreadlist)

route.post('/hotel/roomsimg/:rid',upload.array("image"),Imadd)
route.delete('/hotel/roomsimg/:id',Iremove)
route.post("/roomimages", Iread)


module.exports = route;