

const { nextTick } = require("process");
const con = require("../config/db");
const fs = require("fs");
const path = require("path");

exports.Rlist = (req, res) => {
  try {
    const idhotel = req.params.idhotel;

    if (!idhotel) {
      return res.status(400).send("ไม่พบที่อยู่ห้อง");
    }

    const sql = "SELECT * FROM rooms WHERE hotel_id = ?";
    con.query(sql, [idhotel], (err, result) => {
      if (err) return res.status(500).send("เกิดข้อผิดพลาด");
      if (result.length === 0)
        return res.status(404).send("ไม่พบห้องในโรงแรมนี้");
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.send("err มันมาอีกเเล้ว").status(500);
  }
};

exports.Rread = async (req, res) => {
  try {
    const { idhotel, id } = req.params;

    if (!idhotel) return res.status(400).json({ message: "ไม่พบ hotel id" });

    if (id && id !== "all") {
      const [result] = await con.query(
        "SELECT * FROM rooms WHERE id = ? AND hotel_id = ?",
        [id, idhotel],
      );
      if (result.length === 0)
        return res.status(404).json({ message: "ไม่พบห้องนี้" });

      const [images] = await con.query(
        "SELECT * FROM room_images WHERE room_id = ?",
        [result[0].id],
      );
      return res.json({ ...result[0], images });
    }

    const [results] = await con.query(
      "SELECT * FROM rooms WHERE hotel_id = ?",
      [idhotel],
    );

    if (results.length === 0)
      return res.status(200).json([], { message: "ไม่พบห้องในโรงแรมนี้" });

    const rooms = await Promise.all(
      results.map(async (room) => {
        const [images] = await con.query(
          "SELECT * FROM room_images WHERE room_id = ?",
          [room.id],
        );
        return { ...room, images };
      }),
    );

    res.json(rooms);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};


exports.Rremove = async (req, res) => {
  try {
    const {id:idroom } = req.body;
    if (!idroom) return res.status(400).send("ไม่พบ id ห้อง");

    const [rows] = await con.query("SELECT id FROM rooms WHERE id = ?", [idroom]);
    if (!rows.length) return res.status(404).send("ไม่พบห้องนี้");

    await con.query("DELETE FROM room_images WHERE room_id = ?", [idroom]);
    await con.query("DELETE FROM room_availability WHERE room_id = ?", [idroom]);
    await con.query("DELETE FROM bookings WHERE room_id = ?", [idroom]);
    await con.query("DELETE FROM rooms WHERE id = ?", [idroom]);

    res.send({ message: "ลบห้องสำเร็จ", deleted_id: idroom });
  } catch (err) {
    console.log(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

exports.Rcreate = async (req, res) => {
  try {
    const { idhotel, name, description, max_guests, base_price } = req.body;

    const fileImages = req.files ? req.files.map((f) => f.filename) : [];

    if (!idhotel || !name || !base_price) {
      if (req.files?.length) {
        req.files.forEach((f) => fs.unlink(f.path, (err) => err && console.log(err)));
      }
      return res.status(400).send("กรุณากรอกข้อมูลให้ครบ");
    }

    const [result] = await con.query(
      "INSERT INTO rooms (hotel_id, name, description, max_guests, base_price) VALUES (?,?,?,?,?)",
      [idhotel, name, description, max_guests, base_price]
    );

    const newRoomId = result.insertId;

    if (fileImages.length) {
      const insertPromises = fileImages.map((img) =>
        con.query("INSERT INTO room_images (room_id, image_url) VALUES (?,?)", [newRoomId, img])
      );
      await Promise.all(insertPromises);
    }

    res.send({
      message: fileImages.length ? "สร้างห้องและเพิ่มรูปสำเร็จ" : "สร้างห้องสำเร็จ (ไม่มีรูป)",
      room_id: newRoomId,
      total_images: fileImages.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

exports.Redit = async (req, res) => {
  try {
    const { idhotel, name, description, max_guests, base_price, delete_images } = req.body;
    const id = req.params.id;

    if (!idhotel || !name || !base_price) {
      if (req.files?.length) {
        req.files.forEach((f) => fs.unlink(f.path, (err) => err && console.log(err)));
      }
      return res.status(400).send("กรุณากรอกข้อมูลให้ครบ");
    }

    await con.query(
      "UPDATE rooms SET hotel_id=?, name=?, description=?, max_guests=?, base_price=? WHERE id=?",
      [idhotel, name, description, max_guests, base_price, id]
    );

    if (delete_images) {
      const ids = Array.isArray(delete_images) ? delete_images : JSON.parse(delete_images);

      const deletePromises = ids.map(
        (imgId) =>
          new Promise(async (resolve) => {
            const [rows] = await con.query(
              "SELECT image_url FROM room_images WHERE id = ?",
              [imgId]
            );
            if (rows.length) {
              const filePath = path.join(__dirname, "..", "upload", path.basename(rows[0].image_url));
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
              await con.query("DELETE FROM room_images WHERE id = ?", [imgId]);
            }
            resolve();
          })
      );
      await Promise.all(deletePromises);
    }

    const [existing] = await con.query(
      "SELECT COUNT(*) as count FROM room_images WHERE room_id = ?",
      [id]
    );
    const newFiles = req.files || [];
    const total = existing[0].count + newFiles.length;

    if (total > 5) {
      newFiles.forEach((f) => fs.unlink(f.path, (err) => err && console.log(err)));
      return res.status(400).send(`รูปเกิน 5 รูป (มีอยู่แล้ว ${existing[0].count} รูป)`);
    }

    if (newFiles.length) {
      const sqlImg = "INSERT INTO room_images (room_id, image_url) VALUES (?, ?)";
      const insertPromises = newFiles.map(
        (f) =>
          new Promise((resolve, reject) => {
            con.query(sqlImg, [id, f.filename], (err) =>
              err ? reject(err) : resolve()
            );
          })
      );
      await Promise.all(insertPromises);
    }

    res.send({
      message: "แก้ไขห้องสำเร็จ",
      room_id: id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

exports.Imadd = (req, res) => {
  try {
    const roomid = req.params.rid;

    const fileImages = req.files ? req.files.map((f) => f.filename) : [];
    const urlImages = req.body.image_urls
      ? Array.isArray(req.body.image_urls)
        ? req.body.image_urls
        : [req.body.image_urls]
      : [];
    const allImages = [...fileImages, ...urlImages];

    if (!allImages.length) {
      return res.status(400).send("ไม่มีรูปที่จะเพิ่ม");
    }

    const sqlImg =
      "INSERT INTO `room_images` (`room_id`, `image_url`) VALUES (?,?)";
    const insertPromises = allImages.map(
      (img) =>
        new Promise((resolve, reject) => {
          con.query(sqlImg, [roomid, img], (err) =>
            err ? reject(err) : resolve(),
          );
        }),
    );

    Promise.all(insertPromises)
      .then(() =>
        res.send({
          message: "เพิ่มรูปสำเร็จ",
          room_id: roomid,
          total_images: allImages.length,
        }),
      )
      .catch(() => res.status(500).send("ไม่สามารถเพิ่มรูปได้"));
  } catch (err) {
    console.log(err);
    res.status(500).send("err คับ");
  }
};

exports.Iremove = (req, res) => {
  try {
    const rid = req.params.id;

    // ดึง path รูปก่อนลบ เพื่อลบไฟล์จริงด้วย
    con.query(
      "SELECT `image_url` FROM `room_images` WHERE `id`=?",
      [rid],
      (err, rows) => {
        if (err) return res.status(500).send("มีบางอย่างผิดพลาด");
        if (rows.length === 0)
          return res.status(404).send("ไม่พบรูปที่ต้องการลบ");

        const imgUrl = rows[0].image_url;

        con.query(
          "DELETE FROM `room_images` WHERE `id`=?",
          [rid],
          (err, result) => {
            console.log("rid:", rid); // ✅ เพิ่ม
            console.log("rows:", rows); // ✅ เพิ่ม
            if (err) return res.status(500).send("มีบางอย่างผิดพลาด");
            if (rows.length === 0)
              return res.status(404).send("ไม่พบรูปที่ต้องการลบ");

            // ลบไฟล์จริงด้วย
            const fs = require("fs");
            const path = require("path");
            const filePath = path.join(__dirname, "../upload/rooms", imgUrl);
            fs.unlink(filePath, (err) => {
              if (err) console.log("ลบไฟล์ไม่สำเร็จ:", err.message);
            });

            res.send({ message: "ลบรูปสำเร็จ", deleted_id: rid });
          },
        );
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("err อีกแล้วพรี่");
  }
};

exports.checkroom = async (req, res) => {
  try {
    const { roomid, datein, dateout } = req.body;
    const sql = `SELECT room_id FROM room_availability
       WHERE room_id = ? 
       AND date >= ? AND date < ?
       AND is_available = 0`;
    const [result] = await con.query(sql, [roomid, datein, dateout]);
    if (result.length > 0) {
      return res.status(400).send("ห้องไม่ว่างในช่วงเวลานี้");
    }
    res.send("ห้องว่าง");
  } catch (err) {
    console.log(err);
    res.status(500).send("ไม่สามารถเช็คได้");
  }
};

exports.Rreadlist = async (req, res) => {
  try {
    const { id } = req.body;
    const roomId = Number(id);
    const sql = `SELECT * FROM rooms WHERE id=?`;
    const [result] = await con.query(sql, [id]);
    res.send(result);
  } catch (err) {
    res.send("โหลดไม่สำเร็จจร้า");
    console.log(err);
  }
};

exports.Iread = async (req, res) => {
  const { id } = req.body;
  const [images] = await con.query(
    "SELECT * FROM room_images WHERE room_id = ?",
    [id]
  );
  return res.json(images);
};