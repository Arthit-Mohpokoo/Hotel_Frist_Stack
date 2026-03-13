import React, { useState } from "react";
import { RiHotelLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/usergettoken";
import { CiUser } from "react-icons/ci";

const Navbar = () => {
  const [navbar, setnavbar] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const handleLogout = () => {
    dispatch(logout());
    nav("/SingIn");
  };

  if (user?.role === "customer") {
    return (
      <div className="flex flex-row sticky z-50 top-0 w-full bg-white text-3xl items-center drop-shadow-2xl">
        <div>
          <h1 className="flex items-center font-bold text-3xl text-[var(--clorblue)] m-3">
            <RiHotelLine className="text-[50px] items-center" />
            Hoteal booking
          </h1>
        </div>
        <div className="flex flex-row gap-5 items-center ml-auto mr-10 text-xl">
          <ul className="flex justify-end ml-10 gap-10 text-xl">
            <li onClick={()=>nav("/")} className="hover:text-[var(--clorblue)] text-[var(--text-colorS)] cursor-pointer">
              หน้าเเรก
            </li>
            <li onClick={()=>nav("/Hotels")} className="hover:text-[var(--clorblue)] text-[var(--text-colorS)] cursor-pointer">
              โรงเเรม
            </li>
            <li onClick={()=>nav("/listcheck")} className="hover:text-[var(--clorblue)] text-[var(--text-colorS)] cursor-pointer">
              รายการ
            </li>
          </ul>
          <p
            onClick={() => setnavbar(!navbar)}
            className="flex flex-row  bg-[#efeeee] hover:text-white hover:bg-[var(--hoverblue)] text-[#393939] cursor-pointer px-4 py-2 rounded-full pl-10 pr-10"
          >
            <CiUser className="mt-1  mr-1" />
            {user.name}
          </p>
          {navbar && (
            <div className="absolute top-13  right-4 mt-2 w-35 bg-white border border-gray-200 rounded-lg shadow-lg ">
              <div className="flex flex-col items-center">
                <Link to="/Home">เเก้ไข</Link>
                <input
                type="button"
                onClick={handleLogout}
                value={"LogOut"}
                className="bg-[var(--clorblue)] hover:text-white hover:bg-[var(--hoverblue)] text-white font-bold cursor-pointer px-4 py-2 rounded-md"
              />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row z-50 bg-white text-3xl items-center drop-shadow-2xl">
      <div>
        <h1 className="flex items-center font-bold text-3xl text-[var(--clorblue)] m-3">
          <RiHotelLine className="text-[50px] items-center" />
          Hoteal booking
        </h1>
      </div>
      <div className="flex flex-row gap-5 items-center ml-auto mr-10 text-xl">
        <ul className="flex justify-end ml-10 gap-10 text-xl">
          <li onClick={()=>nav("/")} className="hover:text-[var(--clorblue)] text-[var(--text-colorS)] cursor-pointer">
            หน้าเเรก
          </li>
          <li onClick={()=>nav("/Hotels")} className="hover:text-[var(--clorblue)] text-[var(--text-colorS)] cursor-pointer">
            โรงเเรม
          </li>
        </ul>
        <input
          type="button"
          onClick={() => nav("/Singin")}
          value={"เข้าสู่ระบบ"}
          className="hover:text-[var(--clorblue)] text-[var(--text-colorS)] cursor-pointer"
        />
        <input
          type="button"
          onClick={() => nav("/Singup")}
          value={"สมัครสมาชิก"}
          className="bg-[var(--clorblue)] hover:text-white hover:bg-[var(--hoverblue)] text-white cursor-pointer px-4 py-2 rounded-md"
        />
      </div>
    </div>
  );
};

export default Navbar;
