const express = require("express");
const route = express.Router();
const {list,read,create ,edit,remove} = require("../controllers/Hotel");
const { authCheck } = require("../middleware/auth");
const { upload} = require("../middleware/upload");
const { search } = require("../controllers/hotelse");
const { bookings, customereq, cancelBooking } = require("../controllers/Booking_send");

route.get("/hotel",list)
route.get("/hotel/:id",read)
route.post("/hotel",upload.array("images"),create)
route.put("/hotel/:id",authCheck,edit)
route.delete("/hotel/:id",authCheck,remove)


route.post("/hotel/search/",search)


route.post("/booking",authCheck,bookings)
route.get("/checkbook/:id",customereq)
route.post("/cancelbooking", authCheck, cancelBooking)

module.exports = route;