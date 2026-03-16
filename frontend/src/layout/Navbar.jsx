import React, { useEffect, useState, useRef } from "react";
import { RiHotelLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/usergettoken";
import { CiUser } from "react-icons/ci";
import { databook } from "../funtions/room";

const Navbar = () => {
  const [navbar, setnavbar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const nav = useNavigate();
  const [data, setdata] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    nav("/SingIn");
  };

  useEffect(() => {
    if (!user?.id) return;
    if (user?.role === "hotel_owner") loadata();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setnavbar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadata = () => {
    databook(user.id)
      .then((res) => setdata(res.data))
      .catch((err) => console.log(err));
  };

  const navLinks = (role) => {
    const base = [
      { label: "หน้าแรก", path: "/" },
      { label: "โรงแรม", path: "/Hotels" },
    ];
    if (role === "customer" || role === "hotel_owner") {
      base.push({ label: "รายการ", path: "/listcheck" });
    }
    if (role === "admin") {
      base.push({ label: "รายการ", path: "/listcheck" });
      base.push ({ label: "Admin Dashboard", path: "/dashboard/Admin" });
    }
    if (role === "hotel_owner") {
      base.push({ label: "จัดการโรงแรม", path: `/hotelowner/${user.id}` });
    }
    return base;
  };

  const baseNav = `
    flex flex-row sticky z-50 top-0 w-full items-center
    px-6 py-0 transition-all duration-300
    ${
      scrolled
        ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
        : "bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]"
    }
  `;

  const Logo = () => (
    <button
      onClick={() => nav("/")}
      className="flex items-center gap-2 group py-4"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--clorblue)] to-[var(--hoverblue)] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
        <RiHotelLine className="text-white text-xl" />
      </div>
      <span className="font-bold text-xl tracking-tight">
        <span className="text-[var(--clorblue)]">Hotel</span>
        <span className="text-gray-800">Stack</span>
      </span>
    </button>
  );

  const NavLink = ({ label, path }) => (
    <li
      onClick={() => nav(path)}
      className="
        relative text-sm font-medium text-gray-600 cursor-pointer
        hover:text-[var(--clorblue)] transition-colors duration-200
        after:content-[''] after:absolute after:bottom-[-4px] after:left-0
        after:w-0 after:h-[2px] after:bg-[var(--clorblue)] after:rounded-full
        after:transition-all after:duration-300 hover:after:w-full
      "
    >
      {label}
    </li>
  );

  const UserButton = ({ hasNotif }) => (
    <button
      onClick={() => setnavbar(!navbar)}
      className="
        relative flex items-center gap-2
        bg-gray-50 hover:bg-[var(--clorblue)] text-gray-700 hover:text-white
        border border-gray-200 hover:border-[var(--clorblue)]
        px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200 shadow-sm hover:shadow-md
      "
    >
      {hasNotif && !navbar && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
          {data.length}
        </span>
      )}
      <CiUser className="text-base" />
      <span>{user.name}</span>
      <svg
        className={`w-3 h-3 transition-transform duration-200 ${navbar ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  const Dropdown = ({ showDashboard }) => (
    <div
      className="
      absolute top-[calc(100%+8px)] right-0 min-w-[180px]
      bg-white border border-gray-100 rounded-2xl shadow-xl
      overflow-hidden animate-fadeIn z-50
    "
    >
      <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          เข้าสู่ระบบในชื่อ
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">
          {user.name}
        </p>
      </div>

      <div className="p-2">

        {/* <Link
          to="/Home"
          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:text-[var(--clorblue)] hover:bg-blue-50 rounded-lg transition-all duration-150"
          onClick={() => setnavbar(false)}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          แก้ไขโปรไฟล์
        </Link> */}
        {user.role === "admin" && (
          <Link
            to="/dashboard/Admin"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-150 font-medium"
            onClick={() => setnavbar(false)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Admin Dashboard
          </Link>
        )}
        {showDashboard && (
          <Link
            to={`/dashboard/owner/${user.name}`}
            className="relative flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:text-[var(--clorblue)] hover:bg-blue-50 rounded-lg transition-all duration-150"
            onClick={() => setnavbar(false)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            ผู้เข้าพัก
            {data?.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {data.length}
              </span>
            )}
          </Link>
        )}
      </div>

      <div className="p-2 pt-0">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-2.5 px-3 py-2 text-sm
            text-red-500 hover:text-white hover:bg-red-500
            rounded-lg transition-all duration-150 font-medium
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          ออกจากระบบ
        </button>
      </div>
    </div>
  );

  if (!user?.role) {
    return (
      <nav className={baseNav}>
        <Logo />
        <ul className="flex items-center gap-8 ml-10">
          <NavLink label="หน้าแรก" path="/" />
          <NavLink label="โรงแรม" path="/Hotels" />
        </ul>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => nav("/Singin")}
            className="text-sm font-medium text-gray-600 hover:text-[var(--clorblue)] transition-colors px-4 py-2"
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => nav("/Singup")}
            className="
              text-sm font-semibold text-white
              bg-gradient-to-r from-[var(--clorblue)] to-[var(--hoverblue)]
              px-5 py-2.5 rounded-full shadow-md hover:shadow-lg
              hover:scale-105 transition-all duration-200
            "
          >
            สมัครสมาชิก
          </button>
        </div>
      </nav>
    );
  }

  const links = navLinks(user.role);
  const isOwner = user.role === "hotel_owner";
  const isAdmin = user.role === "admin";

  return (
    <nav className={baseNav}>
      <Logo />

      <ul className="flex items-center gap-8 ml-10">
        {links.map((l) => (
          <NavLink key={l.path} label={l.label} path={l.path} />
        ))}
      </ul>

      <div className="ml-auto relative" ref={dropdownRef}>
        <UserButton hasNotif={isOwner && data?.length > 0} />
        {navbar && <Dropdown showDashboard={isOwner} />}
      </div>
    </nav>
  );
};

export default Navbar;
