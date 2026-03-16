const express = require("express");
const route = express.Router();
const {
  getStats,
  getUsers,
  banUser,
  unbanUser,
  deleteUser,
  changeRole,
  getAllHotels,
  adminDeleteHotel,
} = require("../controllers/admindasboard");
const { authCheck } = require("../middleware/auth");


route.get("/admin/stats",authCheck, getStats);

route.get("/admin/users",authCheck, getUsers);
route.put("/admin/users/:id/ban",authCheck, banUser);
route.put("/admin/users/:id/unban",authCheck, unbanUser);
route.put("/admin/users/:id/role",authCheck, changeRole);
route.delete("/admin/users/:id",authCheck, deleteUser);


route.get("/admin/hotels",authCheck, getAllHotels);
route.delete("/admin/hotels/:id",authCheck, adminDeleteHotel);

module.exports = route;