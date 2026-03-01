exports.validateRoom = (req, res, next) => {
  const { idhotel, name, base_price } = req.body;
  if (!idhotel || !name || !base_price) {
    return res.status(400).send("กรุณากรอกข้อมูลให้ครบ");
  }
  next();
};