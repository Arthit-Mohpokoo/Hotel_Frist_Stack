const jwt = require("jsonwebtoken");

exports.authCheck = (req, res, next) => {
  try {
    const authheader = req.headers.authorization;
    console.log("HEADERS:", req.headers);
    if (!authheader) {
      return res.status(400).send("No token provided");
    }

    const token = authheader.split(" ")[1];
    if (!token ) {
      return res.status(400).send("Token missing");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(500).send(`check token ${err}`);
  }
};

// exports.adminCheck = async (req, res, next) => {
//   const email = req.user.email;
//   const sql = "SELECT * FROM users WHERE email = ?";
//   con.query(sql, [email], (err, result) => {
//     if (err) return res.status(err).send("you not admin!!");
//     next();
//     if (result.length === 0 || result[0].role != admin) {
//       return res.status(403).send("คุณไม่มีสิทธิ์!!");
//     }
//     next();
//   });
// };
