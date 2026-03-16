import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { CiSearch } from "react-icons/ci";
import { PiStarFourThin } from "react-icons/pi";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";
import { MdOutlineSecurity } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { listhotel } from "../funtions/auth";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { search } from "../funtions/room";

export const Home = () => {
  const [data, setdata] = useState([]);
  const [sear, setsear] = useState([]);
  const [view, setview] = useState({
    city: "",
    datein: "",
    dateout: "",
    guests: "",
  });
  const [box, setbox] = useState(false);
  useEffect(() => {
    listhotel()
      .then((res) => {
        setdata(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleChange = (e) => {
    setview({ ...view, [e.target.name]: e.target.value });
  };

  const onsubmit = () => {
    if (!view.city || !view.datein || !view.dateout || !view.guests) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (new Date(view.dateout) <= new Date(view.datein)) {
      alert("วันออกต้องมากกว่าวันเข้า");
      return;
    }

    setbox(true);
    search(view)
      .then((res) => {
        setsear(res.data);
        // console.log(res.data);
      })
      .catch((err) => alert(err.response?.data || "เกิดข้อผิดพลาด"));
  };

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

          <div className="flex flex-col bg-white w-[1500px] h-[200px] rounded-2xl">
            <div className="flex flex-row gap-10 justify-center mt-10 text-2xl">
              <div className="font-black flex-col text-[16px] w-80">
                <select
                  value={view.city}
                  name="city"
                  onChange={handleChange}
                  className="w-full h-10 border rounded px-3"
                >
                  <option value="">เลือกจังหวัด</option>
                  <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                  <option value="กระบี่">กระบี่</option>
                  <option value="กาญจนบุรี">กาญจนบุรี</option>
                  <option value="กาฬสินธุ์">กาฬสินธุ์</option>
                  <option value="กำแพงเพชร">กำแพงเพชร</option>
                  <option value="ขอนแก่น">ขอนแก่น</option>
                  <option value="จันทบุรี">จันทบุรี</option>
                  <option value="ฉะเชิงเทรา">ฉะเชิงเทรา</option>
                  <option value="ชลบุรี">ชลบุรี</option>
                  <option value="ชัยนาท">ชัยนาท</option>
                  <option value="ชัยภูมิ">ชัยภูมิ</option>
                  <option value="ชุมพร">ชุมพร</option>
                  <option value="เชียงราย">เชียงราย</option>
                  <option value="เชียงใหม่">เชียงใหม่</option>
                  <option value="ตรัง">ตรัง</option>
                  <option value="ตราด">ตราด</option>
                  <option value="ตาก">ตาก</option>
                  <option value="นครนายก">นครนายก</option>
                  <option value="นครปฐม">นครปฐม</option>
                  <option value="นครพนม">นครพนม</option>
                  <option value="นครราชสีมา">นครราชสีมา</option>
                  <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
                  <option value="นครสวรรค์">นครสวรรค์</option>
                  <option value="นนทบุรี">นนทบุรี</option>
                  <option value="นราธิวาส">นราธิวาส</option>
                  <option value="น่าน">น่าน</option>
                  <option value="บึงกาฬ">บึงกาฬ</option>
                  <option value="บุรีรัมย์">บุรีรัมย์</option>
                  <option value="ปทุมธานี">ปทุมธานี</option>
                  <option value="ประจวบคีรีขันธ์">ประจวบคีรีขันธ์</option>
                  <option value="ปราจีนบุรี">ปราจีนบุรี</option>
                  <option value="ปัตตานี">ปัตตานี</option>
                  <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
                  <option value="พะเยา">พะเยา</option>
                  <option value="พังงา">พังงา</option>
                  <option value="พัทลุง">พัทลุง</option>
                  <option value="พิจิตร">พิจิตร</option>
                  <option value="พิษณุโลก">พิษณุโลก</option>
                  <option value="เพชรบุรี">เพชรบุรี</option>
                  <option value="เพชรบูรณ์">เพชรบูรณ์</option>
                  <option value="แพร่">แพร่</option>
                  <option value="ภูเก็ต">ภูเก็ต</option>
                  <option value="มหาสารคาม">มหาสารคาม</option>
                  <option value="มุกดาหาร">มุกดาหาร</option>
                  <option value="แม่ฮ่องสอน">แม่ฮ่องสอน</option>
                  <option value="ยโสธร">ยโสธร</option>
                  <option value="ยะลา">ยะลา</option>
                  <option value="ร้อยเอ็ด">ร้อยเอ็ด</option>
                  <option value="ระนอง">ระนอง</option>
                  <option value="ระยอง">ระยอง</option>
                  <option value="ราชบุรี">ราชบุรี</option>
                  <option value="ลพบุรี">ลพบุรี</option>
                  <option value="ลำปาง">ลำปาง</option>
                  <option value="ลำพูน">ลำพูน</option>
                  <option value="เลย">เลย</option>
                  <option value="ศรีสะเกษ">ศรีสะเกษ</option>
                  <option value="สกลนคร">สกลนคร</option>
                  <option value="สงขลา">สงขลา</option>
                  <option value="สตูล">สตูล</option>
                  <option value="สมุทรปราการ">สมุทรปราการ</option>
                  <option value="สมุทรสงคราม">สมุทรสงคราม</option>
                  <option value="สมุทรสาคร">สมุทรสาคร</option>
                  <option value="สระแก้ว">สระแก้ว</option>
                  <option value="สระบุรี">สระบุรี</option>
                  <option value="สิงห์บุรี">สิงห์บุรี</option>
                  <option value="สุโขทัย">สุโขทัย</option>
                  <option value="สุพรรณบุรี">สุพรรณบุรี</option>
                  <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
                  <option value="สุรินทร์">สุรินทร์</option>
                  <option value="หนองคาย">หนองคาย</option>
                  <option value="หนองบัวลำภู">หนองบัวลำภู</option>
                  <option value="อ่างทอง">อ่างทอง</option>
                  <option value="อำนาจเจริญ">อำนาจเจริญ</option>
                  <option value="อุดรธานี">อุดรธานี</option>
                  <option value="อุตรดิตถ์">อุตรดิตถ์</option>
                  <option value="อุทัยธานี">อุทัยธานี</option>
                  <option value="อุบลราชธานี">อุบลราชธานี</option>
                </select>
              </div>

              <div className="flex-col">
                <input
                  value={view.datein}
                  name="datein"
                  onChange={handleChange}
                  type="date"
                  className="w-80 h-12 border-1 font-semibold text-[16px] rounded-[8px] px-4 text-black"
                />
              </div>

              <div className="flex-col">
                <input
                  value={view.dateout}
                  name="dateout"
                  onChange={handleChange}
                  type="date"
                  className="w-80 h-12 border-1 font-semibold text-[16px] rounded-[8px] px-4 text-black"
                />
              </div>

              <div className="flex-col">
                <input
                  value={view.guests}
                  name="guests"
                  onChange={handleChange}
                  type="text"
                  className="w-80 h-12 border-1 text-[16px] rounded-[8px] px-4 text-black"
                  placeholder="จำนวนผู้เข้าพัก..."
                />
              </div>
            </div>

            <div className="flex items-start justify-start w-2xs">
              <button
                onClick={onsubmit}
                className="flex items-center mt-5 text-white bg-[var(--clorblue)] hover:bg-[var(--hoverblue)] ml-15 px-6 py-3 rounded-lg text-2xl"
              >
                <CiSearch className="mr-2" /> ค้นหาโรงเเรม
              </button>
            </div>
          </div>
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
            <HiOutlineArrowTrendingUp className="text-4xl text-[#0adc06]" />
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
        <div className="flex flex-col items-start ml-10">
          <h1 className="text-3xl font-bold text-center mt-10 ml-5">
            โรงเเรมเเนะนำ
          </h1>
          <p>โรงแรมยอดนิยมที่ได้รับคะแนนรีวิวสูงสุด</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {data &&
          data.slice(0, 3).map((item, index) => (
            <Link
              key={item.id || index}
              to={`/Hotels/${item.id}`}
              className="blox"
            >
              <div className="drop-shadow-2xl rounded-3xl group cursor-pointer overflow-hidden">
                {!item.imghotel ? (
                  <div className="w-full h-48 bg-gray-200 bg-cover flex items-center justify-center group-hover:scale-105 transition-all duration-300 ease-in-out">
                    noimg
                  </div>
                ) : (
                  <div
                    className="w-full h-48 bg-gray-200 bg-cover bg-center group-hover:scale-105 transition-all duration-300 ease-in-out"
                    style={{
                      backgroundImage: `url(http://localhost:5500/upload/rooms/${item.imghotel})`,
                    }}
                  ></div>
                )}
                <div className="p-4 bg-white text-black">
                  <h1 className="text-3xl font-bold group-hover:text-[var(--clorblue)] duration-300">
                    {item.name}
                  </h1>
                  <h2 className="flex row-auto">
                    <IoLocationSharp className="mt-1" /> {item.city},{" "}
                    {item.country}
                  </h2>
                  <p className="p-2">{item.description}</p>
                  <p className="p-2">{item.address}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {box && (
        <>
          <div
            onClick={() => setbox(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6"
            >
              <button
                onClick={() => setbox(false)}
                className="absolute top-3 right-3 bg-red-100 border border-red-400 text-red-600 rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-200"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4">ผลการค้นหา</h2>

              {sear && sear.length > 0 ? (
                <div className="flex flex-col gap-4 mt-4">
                  {sear.map((item, index) => (
                    <div
                      key={item.room_id || index}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row border"
                    >
                      <div className="sm:w-56 h-44 shrink-0 overflow-hidden">
                        {item.imghotel ? (
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                              backgroundImage: `url(http://localhost:5500/upload/rooms/${item.imghotel})`,
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            ไม่มีรูป
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between p-4 flex-1">
                        <div>
                          <h3 className="text-lg font-bold text-[#1a1a2e]">
                            {item.hotel_name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {item.room_name}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <FaUsers className="text-[var(--clorblue)]" />
                            <span>รองรับ {item.max_guests} คน</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <span className="text-2xl font-bold text-[var(--clorblue)]">
                            ฿{Number(item.base_price).toLocaleString()}
                            <span className="text-gray-400 text-sm ml-1">
                              /คืน
                            </span>
                          </span>
                          <Link
                            to={`/Hotels/${item.hotel_id}`}
                            className="bg-[var(--clorblue)] hover:bg-[var(--hoverblue)] text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                          >
                            ดูโรงแรม
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-10">
                  ไม่พบโรงแรมที่ตรงกับการค้นหา
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
