const con = require("../config/db");
exports.search = async (req, res) => {
  try {
    const { city, datein, dateout } = req.query;
    const guests = parseInt(req.query.guests) || 1;

    if (!city || !datein || !dateout) {
      return res.status(400).send("กรุณากรอกจังหวัด วันเข้า และวันออกด้วย");
    }

    if (new Date(dateout) <= new Date(datein)) {
      return res.status(400).send("วันออกต้องมากกว่าวันเข้า");
    }

    const [unavailable] = await con.query(
      `SELECT room_id FROM room_availability
       WHERE date >= ? AND date < ? AND is_available = 0`,
      [datein, dateout]
    );

    const unavailableIds = unavailable.map((r) => r.room_id);

    const [result] = await con.query(
      `SELECT h.id AS hotel_id, h.name AS hotel_name, h.city, h.imghotel AS imghotel,
              r.id AS room_id, r.name AS room_name,
              r.max_guests, r.base_price
       FROM hotels h
       JOIN rooms r ON r.hotel_id = h.id
       WHERE h.city = ?
         AND r.max_guests >= ?
         ${
           unavailableIds.length > 0
             ? `AND r.id NOT IN (${unavailableIds.map(() => "?").join(",")})`
             : ""
         }`,
      [city, guests, ...unavailableIds]
    );

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("เกิดข้อผิดพลาดในการค้นหา");
  }
};