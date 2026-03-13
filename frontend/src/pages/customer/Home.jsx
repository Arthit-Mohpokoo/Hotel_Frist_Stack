import React from "react";
import Navbar from "../../layout/Navbar";
import { CiSearch } from "react-icons/ci";
import { PiStarFourThin } from "react-icons/pi";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";
import { MdOutlineSecurity } from "react-icons/md";
export const Homeuser = () => {
  return (
    <div>
      <Navbar className="fixed top-0 left-0 w-full z-50 bg-white shadow-md" />
      <div className="text-6xl w-full h-[500px] flex items-center justify-center text-center font-bold bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex flex-col">
          <h1 className="text-white text-5xl">
            ยินดีต้อนรับสู่เว็บไซต์จองโรงแรมของเรา!
          </h1>

          <p className="text-[#d7e5fd] text-2xl m-5">
            จองโรงแรมคุณภาพ ราคาดี ทั่วประเทศไทย
          </p>
          <from encType="multipart/form-data">
            <div className="flex flex-col   bg-white w-[1500px] h-[200px] rounded-2xl">
            <div className="flex flex-row gap-10 justify-center mt-10 text-2xl">
   
              <div className="flex-col">
                <input
                  type="text"
                  className="w-80 h-12 border-1 text-[16px] rounded-[8px] px-4 text-black"
                  placeholder="ค้นหาโรงแรม..."
                />
              </div>
              <div className="flex-col">
                <input
                  type="date"
                  className="w-80 h-12 border-1 font-semibold text-[16px] rounded-[8px] px-4 text-black"
                  placeholder="ค้นหาโรงแรม..."
                />
              </div>
              <div className="flex-col">
                <input
                  type="date"
                  className="w-80 h-12 border-1 font-semibold text-[16px] rounded-[8px] px-4 text-black"
                  placeholder="ค้นหาโรงแรม..."
                />
              </div>
              <div className="flex-col">
                <input
                  type="text"
                  className="w-80 h-12 border-1 text-[16px] rounded-[8px] px-4 text-black"
                  placeholder="จำนวนผู้เข้าพัก..."
                />
              </div>
            </div>
            <div className="flex items-start justify-start w-2xs">
              <button type="submit" className="flex items-center mt-5 text-white bg-[var(--clorblue)] hover:bg-[var(--hoverblue)] ml-15 px-6 py-3 rounded-lg text-2xl">
                <CiSearch className="mr-2" /> ค้นหาโรงเเรม
              </button>
            </div>
          </div>
          </from>
        </div>
      </div>
      <div className="flex flex-row bg-white w-full h-50 gap-3 content-around justify-around items-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#e0f2ff]">
            <PiStarFourThin className="text-4xl text-[#0084ff]" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">โรงแรมคุณภาพ</h2>
          <p className="text-gray-600">คัดสรรโรงแรมคุณภาพดีทั่วประเทศ</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <h1 className="flex items-center justify-center w-20 h-20 rounded-full bg-[#e5ffe0]">
            <HiOutlineArrowTrendingUp className=" text-4xl text-[#0adc06]" />
          </h1>
          <h2 className="mt-4 text-xl font-semibold">ราคาดีที่สุด</h2>
          <p className="text-gray-600">รับประกันราคาดีที่สุด จองง่ายสะดวก</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#f8afff]">
            <MdOutlineSecurity className="text-4xl text-[#cc00ff]" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">ความปลอดภัย</h2>
          <p className="text-gray-600">ระบบการจองและชำระเงินที่ปลอดภัย</p>
        </div>
      </div>
      <div>
        <div className="flex flex-col items-start ml-10 ">
          <h1 className="text-3xl font-bold text-center mt-10 ml-5">
            โรงเเรมเเนะนำ
          </h1>
          <p>โรงแรมยอดนิยมที่ได้รับคะแนนรีวิวสูงสุด</p>
        </div>
        <div>
      
        </div>
      </div>

      <div></div>
    </div>
  );
};
