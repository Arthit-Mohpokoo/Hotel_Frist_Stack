const con = require("../config/db");

exports.bookings = async (req, res) => {
  try {
    const { userid, roomid, check_in, check_out, totalp, status, _met } =
      req.body;
    console.log("REQ BODY:", req.body);
    // เช็คข้อมูลครบไหม
    if (!userid || !roomid) {
      return res.status(400).send("กรุณากรอกข้อมูลให้ครบ");
    }
    if (!check_in || !check_out || !_met) {
      return res.status(400).send("กรุณากรอกวันที่ให้ครบ");
    }
    if (new Date(check_out) <= new Date(check_in)) {
      return res.status(400).send("วันเช็คเอาท์ต้องหลังวันเช็คอิน");
    }

    const [conflict] = await con.query(
      `SELECT room_id FROM room_availability
       WHERE room_id = ? 
       AND date >= ? AND date < ?
       AND is_available = 0`,
      [roomid, check_in, check_out],
    );

    if (conflict.length > 0) {
      return res.status(400).send("ห้องไม่ว่างในช่วงเวลานี้");
    }

    // insert booking
    const [result] = await con.query(
      `INSERT INTO bookings(user_id, room_id, check_in, check_out, total_price, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userid, roomid, check_in, check_out, totalp, status],
    );

    const days = [];
    const current = new Date(check_in);
    const end = new Date(check_out);

    while (current < end) {
      days.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    for (const day of days) {
      await con.query(
        `INSERT INTO room_availability (room_id, date, price, is_available) 
         VALUES (?, ?, ?, 0)
         ON DUPLICATE KEY UPDATE is_available = 0`,
        [roomid, day, totalp],
      );
    }

    res.status(201).json({
      message: "จองสำเร็จ",
      bookingId: result.insertId,
    });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

exports.customereq = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM bookings WHERE user_id = ?`;
    const [result] = await con.query(sql, [id]);
    res.send(result);
  } catch (err) {
    res.status(500).send("ไม่พบข้อมูล");
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.body;

    // ดึงข้อมูล booking ก่อนเพื่อเอา room_id, check_in, check_out
    const [[booking]] = await con.query(
      `SELECT room_id, check_in, check_out FROM bookings WHERE id = ?`,
      [id]
    );

    if (!booking) {
      return res.status(404).send("ไม่พบการจอง");
    }

    // เปลี่ยน status เป็น cancelled
    await con.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
      [id]
    );

    // คืนห้องว่างในช่วงวันที่จอง
    await con.query(
      `UPDATE room_availability 
       SET is_available = 1 
       WHERE room_id = ? AND date >= ? AND date < ?`,
      [booking.room_id, booking.check_in, booking.check_out]
    );

    res.json({ message: "ยกเลิกสำเร็จ" });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};
