const con = require("../config/db");
exports.search = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const params = [];
    const { keyword, checkin, checkout, guests } = req.body;
    if (!checkin)
      return res.status(400).json({ message: "กรุณากรอกวันที่เข้าพัก" });
    if (!checkout)
      return res.status(400).json({ message: "กรุณากรอกวันที่ออก" });
    if (!guests)
      return res.status(400).json({ message: "กรุณากรอกจำนวนผู้เข้าพัก" });

    let query = `
  SELECT DISTINCT r.id, h.name, h.address
  FROM hotels h
  JOIN rooms r ON r.hotel_id = h.id
  WHERE r.max_guests >= ?
    AND r.id NOT IN (
      SELECT room_id FROM room_availability
      WHERE date >= ? AND date < ?
      AND is_available = 0
    )
`;

    params.push(Number(guests), checkin, checkout);
    if (keyword) {
      query = query.replace("WHERE", "WHERE h.name LIKE ? AND");
      params.unshift(`%${keyword}%`);
    }
    const [results] = await con.query(query, params); // ✅ รัน query จริง
    res.json({ total: results.length, data: results }); // ✅ ส่งผลกลับ
    console.log({ keyword, checkin, checkout, guests });
  } catch (err) {
    console.log(err);
    res.send("ปัญหามันมาอีกเเล้วครับ");
  }
};

exports.check = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.send("ปัญหามันมาอีกเเล้วครับ");
  }
};
