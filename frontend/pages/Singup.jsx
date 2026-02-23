import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiHotelLine } from "react-icons/ri";
import { GoPerson } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Singup = () => {
  const [roleclass, setrolclass] = useState("customer");
  useEffect(() => {}, []);
const nav = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(e.currentTarget);

      const tawan = {
        email: data.get("gmail"),
        name: data.get("name"),
        password: data.get("password"),
        password_con: data.get("password_con"),
        phone: data.get("phone"),
      };
      if (!tawan.email || !tawan.password) {
        alert("กรอกข้อมูลให้ครบ");
        return;
      }

      if (tawan.password !== tawan.password_con) {
        alert("Password ไม่ตรงกัน");
        return;
      }

      if (tawan.password.length < 3) {
        alert("Password ต้องมากกว่า 3 ตัว");
        return;
      }
      const res = await axios.post(
       "http://localhost:5500/api/SingIn",
        tawan,
      );
      nav("/Home")

      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("สมัครไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col items-center  min-h-screen bg-[var(--bg-color)] ">
      <div className="items-center justify-center text-center static pt-10">
        <h1 className="flex items-center font-bold text-3xl text-[var(--clorblue)]">
          <RiHotelLine className="text-[50px] items-center" />
          Hoteal booking
        </h1>
        <br />
        <h2 className="text-2xl"> สมัครสมาชิก </h2>
        <p className="m-5 text-[13] text-[var(--text-colorS)] ">
          สร้างบัญชีเพื่อเริ่มจองโรงแรม
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <form
          method="post"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="border-1 w-[400px] h-[750px] rounded-2xl flex flex-col items-center justify-center bg-white "
        >
          <div className="w-[80%] flex flex-col items-start mb-4">
            <p className="mb-1">อีเมล</p>
            <input
              className=" w-full border-b-2 border-gray-500 focus:outline-none  focus:border-blue-700p-1"
              type="email"
              name="gmail"
              placeholder="your@gmail.com"
            />
          </div>
          <div className="w-[80%] flex flex-col items-start mb-4">
            <p className="mb-1">ชื่อ</p>
            <input
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-blue-700 py-1"
              type="text"
              name="name"
              placeholder="Your name"
            />
          </div>
          <div className="w-[80%] flex flex-col items-start mb-4">
            <p className="mb-1">รหัสผ่าน</p>
            <input
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-blue-700 py-1"
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <div className="w-[80%] flex flex-col items-start mb-4">
            <p className="mb-1">ยืนยันรหัสผ่าน</p>
            <input
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-blue-700 py-1"
              type="password"
              name="password_con"
              placeholder="Confirm Password"
            />
          </div>
          <div className="w-[80%] flex flex-col items-start mb-4">
            <p className="mb-1">เบอร์โทร</p>
            <input
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-blue-700 py-1"
              type="tel"
              name="phone"
              placeholder="Phone"
            />
          </div>
          <div className="flex justify-center gap-6">
            {/* CUSTOMER */}
            <div
              onClick={() => setrolclass("customer")}
              className={`
          w-[140px] h-[140px] rounded-xl border-2
          flex flex-col items-center justify-center
          cursor-pointer transition
          ${
            roleclass === "customer"
              ? "border-blue-600 text-[var(--clorblue)] bg-blue-50 shadow-md"
              : "border-gray-300  hover:border-gray-400"
          }
        `}
            >
              <GoPerson className="text-[50px]" />
              <p className="mt-2">ลูกค้า</p>
            </div>

            <div
              onClick={() => setrolclass("hotel_owner")}
              className={`
          w-[140px] h-[140px] rounded-xl border-2
          flex flex-col items-center justify-center
          cursor-pointer transition
          ${
            roleclass === "hotel_owner"
              ? "border-blue-600  text-[var(--clorblue)] bg-blue-50 shadow-md"
              : "border-gray-300 hover:border-gray-400"
          }
        `}
            >
              <RiHotelLine className="text-[50px]" />
              <p className="mt-2">เจ้าของโรงแรม</p>
            </div>
          </div>
          <input
            className="mt-6 w-[80%] h-10 rounded-xl text-white bg-[var(--clorblue)] hover:bg-[var(--hoverblue)] transition"
            type="submit"
            value="Sign Up"
          />
          <br />
          <p className="text-[13px]">
            มีบัญชีเเล้ว?
            <a href="/Singin" className="text-[var(--clorblue)] font-semibold">
              SingIn
            </a>
          </p>
        </form>
        <br />
        <div className="flex items-center gap-2 text-gray-600  ">
          <a
            href="#"
            className="flex items-center m-5 hover:text-[var(--clorblue)] gap-2 text-[var(--text-colorS) ]"
          >
            <IoMdArrowRoundBack /> ย้อนกลับไปหน้าเเรก
          </a>
        </div>
      </div>
    </div>
  );
};

export default Singup;
