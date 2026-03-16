const con = require("../config/db");

// ─── STATS (ภาพรวม + monthly + top10) ────────────────────
exports.getStats = async (req, res) => {
  try {
    const [[{ total_users }]]    = await con.query("SELECT COUNT(*) AS total_users FROM users");
    const [[{ total_hotels }]]   = await con.query("SELECT COUNT(*) AS total_hotels FROM hotels");
    const [[{ total_bookings }]] = await con.query("SELECT COUNT(*) AS total_bookings FROM bookings");
    const [[{ total_revenue }]]  = await con.query(
      "SELECT COALESCE(SUM(total_price),0) AS total_revenue FROM bookings WHERE status != 'cancelled'"
    );
    const [[{ cancelled }]] = await con.query("SELECT COUNT(*) AS cancelled FROM bookings WHERE status='cancelled'");
    const [[{ confirmed }]] = await con.query("SELECT COUNT(*) AS confirmed FROM bookings WHERE status='confirmed'");
    const [[{ pending }]]   = await con.query("SELECT COUNT(*) AS pending FROM bookings WHERE status='pending'");

    const [monthly] = await con.query(`
      SELECT
        DATE_FORMAT(check_in, '%Y-%m') AS month,
        COUNT(*)                        AS bookings,
        COALESCE(SUM(total_price), 0)   AS revenue
      FROM bookings
      WHERE status != 'cancelled'
        AND check_in >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(check_in, '%Y-%m')
      ORDER BY month ASC
    `);

    const [topBooked] = await con.query(`
      SELECT h.id, h.name, h.city,
             COUNT(b.id)                      AS total_bookings,
             COALESCE(SUM(b.total_price), 0)  AS total_revenue
      FROM hotels h
      JOIN rooms r   ON r.hotel_id = h.id
      JOIN bookings b ON b.room_id = r.id
      WHERE b.status != 'cancelled'
      GROUP BY h.id, h.name, h.city
      ORDER BY total_bookings DESC
      LIMIT 10
    `);

    const [topRevenue] = await con.query(`
      SELECT h.id, h.name, h.city,
             COUNT(b.id)                      AS total_bookings,
             COALESCE(SUM(b.total_price), 0)  AS total_revenue
      FROM hotels h
      JOIN rooms r   ON r.hotel_id = h.id
      JOIN bookings b ON b.room_id = r.id
      WHERE b.status != 'cancelled'
      GROUP BY h.id, h.name, h.city
      ORDER BY total_revenue DESC
      LIMIT 10
    `);

    res.json({
      summary: { total_users, total_hotels, total_bookings, total_revenue, cancelled, confirmed, pending },
      monthly,
      topBooked,
      topRevenue,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "โหลด stats ไม่สำเร็จ" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [users] = await con.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "โหลด users ไม่สำเร็จ" });
  }
};

exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await con.query("SELECT role FROM users WHERE id = ?", [id]);
    if (!rows.length)          return res.status(404).json({ message: "ไม่พบ user" });
    if (rows[0].role === "admin") return res.status(403).json({ message: "ไม่สามารถแบน admin ได้" });
    await con.query("UPDATE users SET is_banned = 1 WHERE id = ?", [id]);
    res.json({ message: "แบน user สำเร็จ" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "แบนไม่สำเร็จ" });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const { id } = req.params;
    await con.query("UPDATE users SET is_banned = 0 WHERE id = ?", [id]);
    res.json({ message: "ปลดแบน user สำเร็จ" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ปลดแบนไม่สำเร็จ" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await con.query("SELECT role FROM users WHERE id = ?", [id]);
    if (!rows.length)          return res.status(404).json({ message: "ไม่พบ user" });
    if (rows[0].role === "admin") return res.status(403).json({ message: "ไม่สามารถลบ admin ได้" });

    await con.query("DELETE FROM bookings WHERE user_id = ?", [id]);
    const [hotels] = await con.query("SELECT id FROM hotels WHERE owner_id = ?", [id]);
    for (const hotel of hotels) {
      const [rooms] = await con.query("SELECT id FROM rooms WHERE hotel_id = ?", [hotel.id]);
      const roomIds = rooms.map((r) => r.id);
      if (roomIds.length) {
        await con.query("DELETE FROM room_images       WHERE room_id IN (?)", [roomIds]);
        await con.query("DELETE FROM room_availability WHERE room_id IN (?)", [roomIds]);
        await con.query("DELETE FROM bookings          WHERE room_id IN (?)", [roomIds]);
        await con.query("DELETE FROM rooms             WHERE hotel_id = ?",   [hotel.id]);
      }
      await con.query("DELETE FROM hotels WHERE id = ?", [hotel.id]);
    }
    await con.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "ลบ user สำเร็จ" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ลบไม่สำเร็จ" });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["customer", "hotel_owner"].includes(role))
      return res.status(400).json({ message: "role ไม่ถูกต้อง" });
    await con.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    res.json({ message: "เปลี่ยน role สำเร็จ" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "เปลี่ยน role ไม่สำเร็จ" });
  }
};

// ─── HOTELS ───────────────────────────────────────────────
exports.getAllHotels = async (req, res) => {
  try {
    const [hotels] = await con.query(`
      SELECT h.*, u.name AS owner_name, u.email AS owner_email,
             COUNT(b.id) AS total_bookings
      FROM hotels h
      JOIN users u ON h.owner_id = u.id
      LEFT JOIN rooms r   ON r.hotel_id = h.id
      LEFT JOIN bookings b ON b.room_id = r.id AND b.status != 'cancelled'
      GROUP BY h.id, u.name, u.email
      ORDER BY h.id DESC
    `);
    res.json(hotels);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "โหลด hotels ไม่สำเร็จ" });
  }
};

exports.adminDeleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await con.query("SELECT id FROM hotels WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "ไม่พบโรงแรม" });

    const [rooms] = await con.query("SELECT id FROM rooms WHERE hotel_id = ?", [id]);
    const roomIds = rooms.map((r) => r.id);
    if (roomIds.length) {
      await con.query("DELETE FROM room_images       WHERE room_id IN (?)", [roomIds]);
      await con.query("DELETE FROM room_availability WHERE room_id IN (?)", [roomIds]);
      await con.query("DELETE FROM bookings          WHERE room_id IN (?)", [roomIds]);
      await con.query("DELETE FROM rooms             WHERE hotel_id = ?",   [id]);
    }
    await con.query("DELETE FROM hotels WHERE id = ?", [id]);
    res.json({ message: "ลบโรงแรมสำเร็จ", deleted_id: id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ลบไม่สำเร็จ" });
  }
};