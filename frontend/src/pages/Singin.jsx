import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiHotelLine } from "react-icons/ri";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../store/usergettoken";
import { useDispatch } from "react-redux";
import { FaRegCreditCard } from "react-icons/fa";
function Singin() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData(e.currentTarget);
      const loin = {
        email: data.get("email"),
        password: data.get("password"),
      };
      const res = await axios.post("http://localhost:5500/api/SingIn",loin);
      alert(res.data);
      dispatch(login({
        email : res.data.payload.email,
        name : res.data.payload.name,
        role : res.data.payload.role,
        token : res.data.token,
      }))
      console.log(res.data.payload.role)
      localStorage.setItem("token",res.data.token )
      localStorage.setItem("user", JSON.stringify(res.data.payload))
      if(res.data.payload.role === "admin"){
        nav("/admin")
      } else if(res.data.payload.role === "customer" || res.data.payload.role === "hotel_owner" ){
        nav("/Home")
      }
      nav("/")
    } catch (err) {
      console.log(err);
      alert("ไม่สามารถเข้าสู่ระบบได้");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center  min-h-screen bg-[var(--bg-color)] ">
        <div className="items-center justify-center text-center static pt-10">
          <h1 className="flex items-center font-bold text-3xl text-[var(--clorblue)]">
            <RiHotelLine className="text-[50px] items-center" />
            Hoteal booking
          </h1>
          <br />
          <h2 className="text-2xl"> ยินดีต้อนรับกลับมา </h2>
          <p className="m-5 text-[13] text-[var(--text-colorS)] ">
            เข้าสู่ระบบเพื่อจองโรงแรม
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <form
          onSubmit={handleSubmit}
            method="post"
            className="border-1 w-[400px] h-[400px] rounded-2xl flex flex-col items-center justify-center bg-white "
          >
            <div className="w-[80%] flex flex-col items-start mb-4">
              <p className="mb-1">อีเมล</p>
              <input
                className=" w-full border-b-2 border-gray-500 focus:outline-none  focus:border-blue-700p-1"
                type="email"
                name="email"
                placeholder="your@gmail.com"
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
            <div className="w-[80%] flex flex-col items-end mb-4">
              <a
                href="#"
                className="mt-3 text-[var(--clorblue)] hover:text-[var(--hoverblue)]"
              >
                ลืมรหัสผ่าน
              </a>
            </div>
            <input
              className=" mt-6 w-[80%] h-10 rounded-xl text-white bg-[var(--clorblue)] hover:bg-[var(--hoverblue)] transition"
              type="submit"
              value="Sign In"
            />
            <br />
            <p className="text-[13px]">
              ยังไม่มีบัญชี?
              <a
                href="/Singup"
                className="text-[var(--clorblue)] font-semibold"
              >
                SingUp
              </a>
            </p>
          </form>
          <br />
          <div className="flex items-center gap-2 text-gray-600  ">
            <a
              href="/"
              className="flex items-center m-5 hover:text-[var(--clorblue)] gap-2 text-[var(--text-colorS) ]"
            >
              <IoMdArrowRoundBack /> ย้อนกลับไปหน้าเเรก
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Singin;
