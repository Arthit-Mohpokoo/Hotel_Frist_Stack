import React from "react";
import { RiHotelLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const nav = useNavigate();
  return (
    <div className="flex flex-row bg-white text-3xl items-center drop-shadow-2xl">
      <div>
        <h1 className="flex items-center font-bold text-3xl text-[var(--clorblue)] m-3">
          <RiHotelLine className="text-[50px] items-center" />
          Hoteal booking
        </h1>
      </div>
      <div className="flex flex-row gap-5 items-center ml-auto mr-10 text-xl">
         <ul className="flex justify-end ml-10 gap-10 text-xl">
          <li className="hover:text-[var(--clorblue)] text-[var(--text-colorS)] cursor-pointer">หน้าเเรก</li>
          <li className="hover:text-[var(--clorblue)] text-[var(--text-colorS)] cursor-pointer">โรงเเรม</li>
        </ul>
        <input type="button" onClick={() => nav("/Singin")} value={"เข้าสู่ระบบ"} className="hover:text-[var(--clorblue)] text-[var(--text-colorS)] cursor-pointer" />
        <input type="button" onClick={() => nav("/Singup")} value={"สมัครสมาชิก"} className="bg-[var(--clorblue)] hover:text-white hover:bg-[var(--hoverblue)] text-white cursor-pointer px-4 py-2 rounded-md" />
      </div>
    </div>
  );
};

export default Navbar;
