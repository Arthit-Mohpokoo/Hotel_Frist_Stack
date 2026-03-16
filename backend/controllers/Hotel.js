
const con = require("../config/db");
exports.list = async (req, res) => {
  try {
    const [results] = await con.query("SELECT * FROM hotels");
    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).send("err อีกเเล้วครับพี่");
  }
};
exports.listid = async (req, res) => {
  try {
    const id = req.params
    const [results] = await con.query("SELECT * FROM hotels Where owner_id");
    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).send("err อีกเเล้วครับพี่");
  }
};

exports.read = async (req, res) => {
  try {
    const Id = req.params.id;
    const [result] = await con.query("SELECT*FROM hotels Where id=?", [Id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "ไม่พบโรงแรมนี้" });
    }
    res.json(result[0]);
  } catch (err) {
    console.log(err);
    res.send("err เป็นเรื่องปกติทำใจเข้าไว้");
  }
};

exports.create = async (req, res) => {
  try {
    const { ownerid, name, description, address, city, country, lat, lng } =
      req.body;
    const fileimg = req.files ? req.files.map((g) => g.filename) : [];
    const urlimg = req.body.img_urls
      ? Array.isArray(req.body.img_urls)
        ? req.body.img_urls
        : [req.body.img_urls]
      : [];
    const allimages = [...fileimg, ...urlimg];
    if (!ownerid || !name || !address || !city || !country) {
      const fs = require("fs");
      req.files?.forEach((g) =>
        fs.unlink(g.path, (err) => err && console.log(err)),
      );
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }
    const [result] = await con.query(
      "INSERT INTO hotels (owner_id, name, description, address, city, country, lat, lng) VALUES (?,?,?,?,?,?,?,?)",
      [ownerid, name, description, address, city, country, lat, lng],
    );
    const hotelId = result.insertId;

    // UPDATE รูปภาพ (ถ้ามี)
    if (allimages.length) {
      await con.query("UPDATE hotels SET imghotel = ? WHERE id = ?", [
        allimages[0],
        hotelId,
      ]);
    }

    res.status(201).json({ message: "เพิ่มโรงแรมเรียบร้อยแล้ว!", hotelId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "เกิดปัญหาระหว่างสร้าง" });
  }
};

exports.edit = async (req, res) => {
  try {
    const Id = req.params.id;
    const { name, description, address, city, country, lat, lng } = req.body;

    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (userRole !== "admin" && userRole !== "hotel_owner") {
      return res.status(403).json({ message: "ไม่มีสิทธิ์แก้ไข" });
    }

    const [rows] = await con.query("SELECT owner_id FROM hotels WHERE id = ?", [Id]);
    if (!rows.length) {
      return res.status(404).json({ message: "ไม่พบโรงแรม" });
    }

    if (rows[0].owner_id !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "คุณไม่มีสิทธิ์แก้ไขโรงแรมนี้" });
    }

    const fileimg = req.files ? req.files.map((g) => g.filename) : [];
    const urlimg = req.body.img_urls
      ? Array.isArray(req.body.img_urls)
        ? req.body.img_urls
        : [req.body.img_urls]
      : [];
    const allimages = [...fileimg, ...urlimg];

    const [result] = await con.query(
      `UPDATE hotels 
       SET name=?, description=?, address=?, city=?, country=?, lat=?, lng=?
       WHERE id=?`,
      [name, description, address, city, country, lat, lng, Id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบโรงแรม หรืออัปเดตไม่สำเร็จ" });
    }

    if (allimages.length > 0) {
      await con.query("UPDATE hotels SET imghotel = ? WHERE id = ?", [
        allimages[0],
        Id,
      ]);
    }

    res.json({ message: "แก้ไขโรงแรมเรียบร้อยแล้ว!", hotelId: Id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "เกิดปัญหาระหว่างแก้ไข" });
  }
};

exports.remove = async (req, res) => {
  try {
    const {id:Id} = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (userRole !== "admin" && userRole !== "hotel_owner") {
      return res.status(403).send("ไม่มีสิทธิ์ลบ");
    }

    const [rows] = await con.query("SELECT owner_id FROM hotels WHERE id = ?", [Id]);
    if (!rows.length) return res.status(404).send("ไม่พบโรงแรม");
    if (rows[0].owner_id !== userId && userRole !== "admin") {
      return res.status(403).send("คุณไม่มีสิทธิ์ลบโรงแรมนี้");
    }

    const [rooms] = await con.query("SELECT id FROM rooms WHERE hotel_id = ?", [Id]);
    const roomIds = rooms.map((r) => r.id);

    if (roomIds.length) {
      await con.query("DELETE FROM room_images WHERE room_id IN (?)", [roomIds]);
      await con.query("DELETE FROM room_availability WHERE room_id IN (?)", [roomIds]);
      await con.query("DELETE FROM bookings WHERE room_id IN (?)", [roomIds]);
      await con.query("DELETE FROM rooms WHERE hotel_id = ?", [Id]);
    }

    await con.query("DELETE FROM hotels WHERE id = ?", [Id]);

    res.send({ message: "ลบโรงแรมสำเร็จ", deleted_id: Id });
  } catch (err) {
    console.log(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};
