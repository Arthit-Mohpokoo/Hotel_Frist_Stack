const con = require("../config/db");
const upload = require("../middleware/upload");

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

exports.Rread = (req, res) => {
  try {
    const idroom = req.params.idhotel;
    const id = req.params.id;

    if (!idroom) {
      return res.status(400).send("rooms ไม่พบที่อยู่ห้อง");
    }
    const sql = "SELECT * FROM rooms WHERE hotel_id = ?";
    con.query(sql, [idroom], (err, result) => {
      if (err) return res.status(500).send("เกิดปัญหาในการค้นหาห้องจร้า");
      if (result.length === 0) return res.status(404).send("ไม่พบห้องนี้");
      const sql = "SELECT * FROM rooms WHERE id=?";
      con.query(sql, id, (err, result) => {
        if (err) return res.status(500).send("ปํญหามันมาอีกเเล้ว");
        if (result.length === 0) return res.status(404).send("ไม่พบห้องนี้");
        res.send(result);
      });
    });
  } catch (err) {
    console.log(err);
    res.send("err มันมาอีกเเล้ว").status(500);
  }
};

exports.Rcreate = (req, res) => {
  // try {
  //   const { idhotel, name, description, max_guests, base_price } = req.body;
  //    const urlimg = req.file ? req.file.filename : null;

  //   if (!idhotel || !name || !base_price) {
  //     if (req.file) {
  //       const fs = require("fs");
  //       fs.unlink(req.file.path, (err) => {
  //         if (err) console.log("ลบรูปไม่สำเร็จ:", err);
  //       });
  //     }
  //     // return res.status(400).send("กรุณากรอกข้อมูลให้ครบ");
  //     return res.status(400).send("กรุณากรอกข้อมูลให้ครบ");
  //   }

  //   const sql =
  //     "INSERT INTO `rooms` (`hotel_id`, `name`, `description`, `max_guests`, `base_price`) VALUES (?,?,?,?,?)";
  //   con.query(sql,[idhotel, name, description, max_guests, base_price],
  //     (err, result) => {
  //       if (err) return res.status(500).send("ไม่สามารถสร้างห้องได้");

  //       const newRoomId = result.insertId;

  //       if (!urlimg)
  //         return res.send({
  //           message: "สร้างห้องสำเร็จ (ไม่มีรูป)",
  //           room_id: newRoomId,
  //         });
  //       const sqlImg ="INSERT INTO `room_images` (`room_id`, `image_url`) VALUES (?,?)";
  //       con.query(sqlImg, [newRoomId, urlimg], (err, imgResult) => {

  //         if (err)
  //           return res.status(500).send("สร้างห้องสำเร็จแต่ไม่สามารถเพิ่มรูปได้");
  //           res.send({message: "สร้างห้องและเพิ่มรูปสำเร็จ", room_id: newRoomId,
  //         });
  //       });
  //     },
  //   );
  // } catch (err) {
  //   console.log(err);
  //   res.send("err จร้าคิดไงดี").status(500);
  // }
  try {
    const { idhotel, name, description, max_guests, base_price } = req.body;

    const fileImages = req.files ? req.files.map((f) => f.filename) : [];
    const urlImages = req.body.image_urls
      ? Array.isArray(req.body.image_urls)
        ? req.body.image_urls
        : [req.body.image_urls]
      : [];
    const allImages = [...fileImages, ...urlImages];

    if (!idhotel || !name || !base_price) {
      if (req.files?.length) {
        const fs = require("fs");
        req.files.forEach((f) =>
          fs.unlink(f.path, (err) => err && console.log(err)),
        );
      }
      return res.status(400).send("กรุณากรอกข้อมูลให้ครบ");
    }

    const sql =
      "INSERT INTO `rooms` (`hotel_id`, `name`, `description`, `max_guests`, `base_price`) VALUES (?,?,?,?,?)";

    con.query(
      sql,
      [idhotel, name, description, max_guests, base_price],
      (err, result) => {
        if (err) return res.status(500).send("ไม่สามารถสร้างห้องได้");

        const newRoomId = result.insertId;

        if (!allImages.length)
          return res.send({
            message: "สร้างห้องสำเร็จ (ไม่มีรูป)",
            room_id: newRoomId,
          });

        const sqlImg =
          "INSERT INTO `room_images` (`room_id`, `image_url`) VALUES (?,?)";
        const insertPromises = allImages.map(
          (img) =>
            new Promise((resolve, reject) => {
              con.query(sqlImg, [newRoomId, img], (err) =>
                err ? reject(err) : resolve(),
              );
            }),
        );

        // ✅ Promise.all อยู่ใน callback ถูกที่แล้ว
        Promise.all(insertPromises)
          .then(() =>
            res.send({
              message: "สร้างห้องและเพิ่มรูปสำเร็จ",
              room_id: newRoomId,
              total_images: allImages.length,
            }),
          )
          .catch(() =>
            res
              .status(500)
              .send("สร้างห้องสำเร็จแต่ไม่สามารถเพิ่มรูปบางรูปได้"),
          );
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

exports.Rremove = (req, res) => {
  try {
    const idroom = req.params.id;
    if (!idroom) {
      return res.status(400).send("rooms ไม่พบที่อยู่ห้อง");
    }
    const checkSql = "SELECT id FROM rooms WHERE id = ?";
    con.query(checkSql, [idroom], (err, rows) => {
      if (err) return res.status(500).send("เกิดข้อผิดพลาด");
      if (!rows.length) return res.status(404).send("ไม่พบห้องนี้");

      // ลบรูปก่อน แล้วค่อยลบห้อง
      const deleteImgSql = "DELETE FROM room_images WHERE room_id = ?";
      con.query(deleteImgSql, [idroom], (err) => {
        if (err) return res.status(500).send("ไม่สามารถลบรูปห้องได้");

        const sql = "DELETE FROM rooms WHERE id = ?";
        con.query(sql, [idroom], (err, result) => {
          if (err) return res.status(500).send("ไม่สามารถลบห้องได้");
          res.send({ message: "ลบห้องสำเร็จ", deleted_id: idroom });
        });
      });
    });
  } catch (err) {}
};
