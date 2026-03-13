
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

exports.edit = (req, res) => {
  try {
    const Id = req.params.id;
    const { ownerid, name, description, address, city, country, lat, lng } =
      req.body;

    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (userRole !== "admin" && userRole !== "hotel_owner") {
      return res.status(403).send("ไม่มีสิทธิ์แก้ไข");
    }
    if (ownerid != userId && userRole !== "admin") {
      return res.status(400).send("คุณไม่มีสิทธิ์เเก้ไข1");
    }

    const sql = `
          UPDATE hotels 
          SET owner_id=? , name=?, description=?, address=?, city=?, country=?, lat=?, lng=?
          WHERE id=?`;

    con.query(
      sql,
      [ownerid, name, description, address, city, country, lat, lng, Id],
      (err, result) => {
        if (err) return res.status(500).send("update ผิดพลาด");
        res.send(result);
      },
    );
  } catch (err) {
    res.status(500).send("server error");
  }
};
exports.remove = (req, res) => {
  try {
    const Id = req.params.id;
    const { ownerid } = req.body;

    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (userRole !== "admin" && userRole !== "hotel_owner") {
      return res.status(403).send("ไม่มีสิทธิ์แก้ไข");
    }
    if (ownerid != userId && userRole !== "admin") {
      return res.status(400).send("คุณไม่มีสิทธิ์เเก้ไข1");
    }

    const sql = `
          DELETE FROM hotels WHERE id=?`;
    con.query(sql, [Id], (err, result) => {
      if (err) return res.status(500).send("remove ผิดพลาด");
      res.send(result);
    });
  } catch (err) {
    res.status(500).send("server error");
  }
};
