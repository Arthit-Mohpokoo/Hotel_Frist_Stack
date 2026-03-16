# 📦 NPM Installation — Hotel_Stack

---

## ⚙️ Backend

```bash
cd backend
npm init -y
npm install express cors morgan dotenv body-parser
npm install bcryptjs jsonwebtoken
npm install mysql2
npm install multer
npm install nodemon
```

หรือติดตั้งทีเดียว

```bash
npm install express cors morgan dotenv body-parser bcryptjs jsonwebtoken mysql2 multer nodemon
```

---

## 💻 Frontend

```bash
npm create vite@latest frontend
# เลือก React → JavaScript
cd frontend
npm install
```

```bash
npm install axios
npm install react-router-dom
npm install react-icons
npm install tailwindcss @tailwindcss/vite
npm install @reduxjs/toolkit react-redux
npm install recharts
npm install promptpay-qr qrcode.react
```

หรือติดตั้งทีเดียว

```bash
npm install axios react-router-dom react-icons tailwindcss @tailwindcss/vite @reduxjs/toolkit react-redux recharts promptpay-qr qrcode.react
```

---

## สรุป Package ทั้งหมด

### Backend
| Package | หน้าที่ |
|---|---|
| `express` | Web framework |
| `cors` | อนุญาต Cross-Origin Request |
| `morgan` | Log HTTP request |
| `dotenv` | อ่านค่าจาก .env |
| `body-parser` | Parse request body |
| `bcryptjs` | Hash password |
| `jsonwebtoken` | สร้างและตรวจสอบ JWT |
| `mysql2` | เชื่อมต่อ MySQL |
| `multer` | อัปโหลดไฟล์/รูปภาพ |
| `nodemon` | Auto-restart server |

### Frontend
| Package | หน้าที่ |
|---|---|
| `axios` | HTTP request |
| `react-router-dom` | Routing |
| `react-icons` | Icon library |
| `tailwindcss` | CSS utility framework |
| `@tailwindcss/vite` | Tailwind plugin สำหรับ Vite |
| `@reduxjs/toolkit` | State management |
| `react-redux` | เชื่อม Redux กับ React |
| `recharts` | กราฟ/Chart สำหรับ Dashboard |
| `promptpay-qr` | สร้าง PromptPay payload |
| `qrcode.react` | แสดง QR Code |
