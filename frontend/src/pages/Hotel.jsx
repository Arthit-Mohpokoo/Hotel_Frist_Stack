import React, { useState, useEffect, use } from "react";
import Navbar from "../layout/Navbar";
import { RiListSettingsFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { listhotel } from "../funtions/auth";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";

const Hotel = () => {
  const [price, setPrice] = useState(100);
  const [data, setdata] = useState([]);
  useEffect(() => {
    listhotel()
      .then((res) => {
        setdata(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Navbar className="fixed top-0 left-0 w-full z-50 bg-white shadow-md" />
      <div className="p-3">
        <h1 className="text-4xl font-bold">โรงแรมทั้งหมด</h1>
        <p className=" text-xl mt-2 text-[#4e4c4c]">
          พบโรงแรม {"icon"} แห่งที่ตรงกับการค้นหาของคุณ
        </p>
        <div className="row-auto flex h-full mt-5">
          <div className="w-[20%] p-3 ">
            <form encType="multipart/form-data">
              <div className=" h-auto top-5 p-5 rounded-2xl shadow-2xl">
                <div className="row flex justify-between font-bold text-2xl ">
                  <h2>ตัวกรอง</h2>
                  <RiListSettingsFill className="justify-end" />
                </div>
                <div>
                  <div className="flex flex-col justify-center ">
                    <label className="pt-3">
                      {Number(price).toLocaleString()} บาท
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-12 accent-blue-500"
                      placeholder="จำนวนเงิน"
                    />
                  </div>

                  <h2 className="font-bold pt-3">เมือง</h2>
                  <div>
                    <select
                      name="province"
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
                  <h2 className="font-bold pt-3">คะแนนรีวิว</h2>
                  <div>
                    <input type="checkbox" name="score" /> คะเเนน
                  </div>
                </div>
                <div className="flex justify-center pt-5">
                  <button
                    type="submit"
                    className="flex items-center mt-5 text-white bg-[var(--clorblue)] hover:bg-[var(--hoverblue)]  px-6 py-3 rounded-lg "
                  >
                    <CiSearch className="mr-2" /> ค้นหาโรงเเรม
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="w-[80%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {data &&
                data.slice(0, 3).map((item, index) => (
                  <Link
                    key={item.id || index}
                    to={`/Hotels/${item.id}`}
                    className="blox"
                  >
                    <div
                      key={index}
                      className="drop-shadow-2xl rounded-3xl group cursor-pointer overflow-hidden"
                    >
                      {!item.imghotel ? (
                        <div
                          className="w-full h-48 bg-gray-200 bg-cover flex items-center justify-center group-hover:scale-105 
                             transition-all duration-300 ease-in-out"
                        >
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
                        <h2 className="flex row-auto ">
                          <IoLocationSharp className="mt-1" /> {item.city}, {item.country}
                        </h2>
                        <p>{item.description}</p>
                        <p>{item.address}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;
