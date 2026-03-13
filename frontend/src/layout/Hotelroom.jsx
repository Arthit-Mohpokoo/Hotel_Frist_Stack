import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { read } from "../funtions/auth";
import { hotelrooms, listto } from "../funtions/room";
import Navbar from "./Navbar";
import { FaUsers } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { Sliderimg } from "../funtions/sliderimg";
import { useSelector } from "react-redux";

const Hotelroom = () => {
  const [data, setData] = useState([]);
  const [data2, setdata2] = useState([]);
  const params = useParams();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    read(params.id)
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.log(err));
    hotelrooms(params.id)
      .then((res) => {
        // console.log(res.data);
        setdata2(res.data);
      })
      .catch((err) => {
        setdata2([]);
        console.log(err);
      });
  };

  

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="m-4">
        {!data.imghotel ? (
          <div
            className="w-95 h-48 bg-gray-200 bg-cover flex items-center justify-center group-hover:scale-105 
                transition-all duration-300 ease-in-out"
          >
            null
          </div>
        ) : (
          <div
            className="relative w-full h-100 bg-gray-200 bg-cover bg-no-repeat bg-center flex items-center justify-center group-hover:scale-105 
                 transition-all duration-300 ease-in-out rounded-2xl"
            style={{
              backgroundImage: `url(http://localhost:5500/upload/rooms/${data.imghotel})`,
            }}
          >
            <div className="flex flex-col left-4 bottom-4 absolute text-white group">
              <h1 className="text-7xl font-bold duration-300">
                {data.name} <br />
              </h1>
              <h2 className="flex items-center text-2xl m-2">
                <IoLocationSharp className="font-bold" /> {data.city},{" "}
                {data.country}
              </h2>
            </div>
          </div>
        )}
        <div className="w-full h- m-2 shadow-2xl bg-white p-4 rounded-2xl border-0.5">
          <h1 className="text-3xl mt-4 font-bold">เกี่ยวกับโรงเเรม</h1>
          <p className="text-[16px] mt-2 text-[#424242]">{data.description}</p>
          <h1 className="text-3xl mt-4 font-bold">ที่อยู่</h1>
          <p className="text-[16px] mt-2 text-[#424242]">{data.address}</p>
        </div>
        <h1 className="text-3xl mt-10 font-bold">ห้องที่มีให้บริการ</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols gap-1 p-4">
          {data2 && data2.length > 0 ? (
            data2.map((item, index) => (
              <div key={item.id || index}>
                {!item.images || item.images.length === 0 || !data2 ? (
                  <div className="m-3">
                    <div className="flex flex-col h-45 bg-gray-200 drop-shadow-2xl rounded-t-2xl"></div>
                    <div className=" bg-white drop-shadow-2xl rounded-b-2xl p-2">
                      <h1 className="font-bold text-2xl">{item.name}</h1>
                      <h2>{item.description}</h2>
                      <div className="flex flex-row">
                        <FaUsers className="m-1 text-[var(--clorblue)]" />
                        <h2>{item.max_guests}</h2>
                      </div>
                      <div className="w-full h-0.5 rounded-2xl bg-gray-200 mt-3 mb-3"></div>
                      <div className="flex justify-between text-white font-bold mb-3">
                        <h1 className="text-[var(--clorblue)] text-2xl row-auto flex">
                          {item.base_price}
                          {
                            <p className="text-black text-[16px] font-light mt-2 ml-1 ">
                              /คืน
                            </p>
                          }
                        </h1>
                        {user?.role === "customer" ? (
                          <Link
                            to={`/Hotels/rooms/${data.id}/${item.id}`}
                            className="flex justify-center cursor-pointer text-xl mr-3 mb-2 p-1 w-25 bg-[var(--clorblue)]"
                            style={{ borderRadius: "4px" }}
                          >
                            จองเลย
                          </Link>
                        ) : (
                          <button
                            onClick={() => alert("กรูณาเข้าสู่ระบบ")}
                            className="flex justify-center cursor-pointer text-xl mr-3 mb-2 p-1 w-25 bg-[var(--clorblue)]"
                            style={{ borderRadius: "4px" }}
                          >
                            จองเลย
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="m-3">
                    <div className="relative h-45 overflow-hidden rounded-t-2xl">
                      <Sliderimg images={item.images || []} />
                    </div>
                    <div className=" bg-white drop-shadow-2xl rounded-b-2xl p-2">
                      <h1 className="font-bold text-2xl">{item.name}</h1>
                      <h2>{item.description}</h2>
                      <div className="flex flex-row">
                        <FaUsers className="m-1 text-[var(--clorblue)]" />
                        <h2>{item.max_guests}</h2>
                      </div>
                      <div className="w-full h-0.5 rounded-2xl bg-gray-200 mt-3 mb-3"></div>
                      <div className="flex justify-between text-white font-bold mb-3">
                        <h1 className="text-[var(--clorblue)] text-2xl row-auto flex">
                          {item.base_price}
                          {
                            <p className="text-black text-[16px] font-light mt-2 ml-1 ">
                              /คืน
                            </p>
                          }
                        </h1>
                        {user?.role === "customer" ? (
                          <Link
                            to={`/Hotels/rooms/${data.id}/${item.id}`}
                            className="flex justify-center cursor-pointer text-xl mr-3 mb-2 p-1 w-25 bg-[var(--clorblue)]"
                            style={{ borderRadius: "4px" }}
                          >
                            จองเลย
                          </Link>
                        ) : (
                          <button
                            onClick={() => alert("กรูณาเข้าสู่ระบบ")}
                            className="flex justify-center cursor-pointer text-xl mr-3 mb-2 p-1 w-25 bg-[var(--clorblue)]"
                            style={{ borderRadius: "4px" }}
                          >
                            จองเลย
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="w-full col-span-3 flex justify-center gap-0 text-gray-400 mt-10 mb-10">
              ไม่มีห้องว่าง
            </div>
          )}
        </div>
        <h1 className="text-3xl mt-10 font-bold">รีวิวจากผู้เข้าพัก</h1>
      </div>
      <div className="w-full m-4">
        <div className="w-full col-span-3 flex justify-center gap-0 text-gray-400 mt-10 mb-10">
          ไม่มีคอมเม้น
        </div>
      </div>
    </div>
  );
};

export default Hotelroom;
