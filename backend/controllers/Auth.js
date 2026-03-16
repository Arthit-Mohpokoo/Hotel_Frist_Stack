const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const con = require("../config/db");

exports.register = async(req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // เงื่อนไขหากข้อมูลว่าง
    if (!name) {
      return res.status(400).send("กรุณาใส่ชื่อ");
    } else if (!email) {
      return res.status(400).send("กรุณากรอกอีเมล");
    } else if (!password) {
      return res.status(400).send("กรุณาใส่รหัส");
    } else if (!phone) {
      return res.status(400).send("กรุณาใส่เบอร์");
    }

    // เช็ค user หากมีข้อมูลซ้ำ
    const checkUser = "SELECT * FROM users WHERE email =? ";

    con.query(checkUser, email, async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Err");
      }
      if (result.length > 0) {
        return res.status(400).send("มีชื่อผู้ใช้ในระบบเเล้ว");
      }

      // ทำการ hash password
      const sql = `INSERT INTO users (name , email  ,password_hash ,phone,role) VALUES (?,?,?,?,?)`;
      const hashPass = await bcrypt.hash(password, 10);

      // เพิ่มข้อมูล
      con.query(sql, [name, email, hashPass, phone, role], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Server Err");
        }
      });
      res.json({ message: `Success`, insertId: result.insertId });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Err จร้า");
  }
};

exports.login = async(req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.send("กรุณากรอกอีเมล");
    } else if (!password) {
      return res.send("กรุณากรอกรหัสผ่าน");
    }
    const [result] = await con.query("SELECT * FROM users WHERE email = ?", [email]);
    

      if (result.length === 0) {
        return res.status(400).send("กรุณาสมัครบัญชี");
      }

      const isPassword = await bcrypt.compare(
        password,
        result[0].password_hash,
      );
      if (!isPassword) {
        return res.status(400).send("รหัสไม่ถูกต้อง");
      }
      var payload = {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        phone: result[0].phone,
        role: result[0].role,
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        // (err, token) => {
        //   if (err) throw err;
        //   res.json({ payload, token });
        // },
      );
      res.json({payload,token})
    // });
  } catch (err) {
    console.log(err);
    res.status(500).send("Login Err");
  }
};

exports.current = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const email = req.user.email;
    // const sql = "SELECT * FROM users WHERE email = ?";

    const [result] = await con.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("niceguy");
  }
};
