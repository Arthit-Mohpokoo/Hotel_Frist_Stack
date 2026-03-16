const express = require("express");
const route = express.Router();
const {list,read,create ,edit,remove, listid} = require("../controllers/Hotel");
const { authCheck } = require("../middleware/auth");
const { upload} = require("../middleware/upload");
const { bookings, customereq, cancelBooking, resdatabook, updatebooking,resdatabookplse,review } = require("../controllers/Booking_send");
const { search } = require("../controllers/hotelse");

route.get("/hotel",list)
route.get("/hotelmanager/:id",listid)
route.get("/hotel/:id",read)
route.post("/hotel",authCheck,upload.array("images",5),create)
route.put("/hotel/:id",authCheck,upload.array("images"),edit)
route.post("/hotel/delete", authCheck, remove)


route.get("/search",search)


route.post("/booking",authCheck,bookings)
route.get("/checkbook/:id",customereq)
route.post("/cancelbooking", authCheck, cancelBooking)
route.post("/dashboard/owner",authCheck,resdatabook)
route.post("/dashboard/ownercheck",authCheck,resdatabookplse)
route.put("/bookings/update", authCheck, updatebooking);
route.post("/review", authCheck, review);

module.exports = route;