import React from "react";
import Navbar from "../layout/navbar";
import { CiSearch } from "react-icons/ci";
export const Home = () => {
  return (
    <div>
      <Navbar />
      
      <div className="text-6xl w-full h-[500px] flex items-center justify-center text-center font-bold bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex flex-col">
          <h1 className="text-white text-5xl">
            ยินดีต้อนรับสู่เว็บไซต์จองโรงแรมของเรา!
          </h1>
          
          <p className="text-[#d7e5fd] text-2xl m-5">
            จองโรงแรมคุณภาพ ราคาดี ทั่วประเทศไทย
          </p>
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
              <button className="flex items-center mt-5 text-white bg-[var(--clorblue)] hover:bg-[var(--hoverblue)] ml-15 px-6 py-3 rounded-lg text-2xl">
               <CiSearch className="mr-2" /> ค้นหาโรงเเรม
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
