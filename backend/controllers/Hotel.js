const con = require("../config/db");
exports.list = (req, res) => {
  try {
    const sql = "SELECT*FROM hotels";
    con.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send("ดึงข้อมูลไม่สำเร็จจร้า");
      }
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("err อีกเเล้วครับพี่");
  }
};

exports.read = (req, res) => {
  try {
    const Id = req.params.id;
    const sql = "SELECT*FROM hotels Where id=?";
    con.query(sql, Id, (err, result) => {
      if (err) {
        console.log(err);
        res.send("ดึงข้อมูลไม่สำเร็จจร้า");
      }
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.send("err เป็นเรื่องปกติทำใจเข้าไว้");
  }
};

exports.create = (req, res) => {
  const { ownerid, name, description, address, city, country, lat, lng } =
    req.body;
  const sql =
    "INSERT INTO `hotels` (`owner_id`, `name`, `description`, `address`, `city`, `country`, `lat`, `lng`) VALUES (?,?,?,?,?,?,?,?);";
  con.query(
    sql,
    [ownerid, name, description, address, city, country, lat, lng],
    (err, result) => {
      if (err) {
        res.send(err + "err อีกเเล้วพี่ผมทำไงดีครับพรี่");
      }
      if (!req.body) {
        res.send("กรอกข้อมูลให้ครบ");
      }
      res.status(201).json({
        message: "เพิ่มโรงแรมเรียบร้อยแล้ว!",
        hotelId: result.insertId, // ส่ง ID ที่เพิ่งสร้างกลับไปให้หน้าบ้านใช้ต่อ
      });
    },
  );
};

exports.edit = (req, res) => {
  try {
    const Id = req.params.id;
    const { ownerid,name, description, address, city, country, lat, lng } =
      req.body;

    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (userRole !== "admin" && userRole !== "hotel_owner") {
      return res.status(403).send("ไม่มีสิทธิ์แก้ไข");
    }
    if(ownerid != userId && userRole !== "admin"  ){
      return res.status(400).send("คุณไม่มีสิทธิ์เเก้ไข1")
    }

    const sql = `
          UPDATE hotels 
          SET owner_id=? , name=?, description=?, address=?, city=?, country=?, lat=?, lng=?
          WHERE id=?`;

        con.query(
          sql,
          [ownerid,name, description, address, city, country, lat, lng ,Id],
          (err, result) => {
            if (err) return res.status(500).send("update ผิดพลาด");
            res.send(result);
          }
        );
  } catch (err) {
    res.status(500).send("server error");
  }
};
exports.remove = (req, res) => {
  try {
    const Id = req.params.id;
    const { ownerid } =
      req.body;

    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (userRole !== "admin" && userRole !== "hotel_owner") {
      return res.status(403).send("ไม่มีสิทธิ์แก้ไข");
    }
    if(ownerid != userId && userRole !== "admin"  ){
      return res.status(400).send("คุณไม่มีสิทธิ์เเก้ไข1")
    }

    const sql = `
          DELETE FROM hotels WHERE id=?`;
        con.query(
          sql,
          [Id],
          (err, result) => {
            if (err) return res.status(500).send("remove ผิดพลาด");
            res.send(result);
          }
        );
  } catch (err) {
    res.status(500).send("server error");
  }
};