import React, { useEffect, useState } from "react";
import Navbar from "../../layout/Navbar";
import { useSelector } from "react-redux";
import { hotelcreate, listHotelid, removeHotel } from "../../funtions/room";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { IoTrashBin } from "react-icons/io5";

const ManagerHotel = () => {
  const user = useSelector((state) => state.user.user);
  const [showput, setshowput] = useState(false);
  const [hotel, sethotel] = useState([]);
  const params = useParams();
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    lat: "",
    lng: "",
    images: null,
  });
  const nav = useNavigate();

  const hotelDelete = (id) => {
    if (!confirm("คุณแน่ใจที่จะลบ?")) return;
    removeHotel(id)
      .then(() => loadData())
      .catch((err) => {
        console.log(err);
        alert("ลบผิดพลาด");
      });
  };
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    listHotelid(params.id)
      .then((res) => {
        // console.log(res.data);
        sethotel(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (files && files[0]) {
      setPreview(URL.createObjectURL(files[0]));
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("user.id:", user.id);
      console.log("form:", form);
      const formData = new FormData();
      formData.append("ownerid", user.id);
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("country", form.country);
      formData.append("lat", form.lat);
      formData.append("lng", form.lng);
      if (form.images) formData.append("images", form.images);

      await hotelcreate(formData);
      alert("เพิ่มโรงแรมเรียบร้อยแล้ว!");
      setshowput(false);
      setPreview(null);
      setForm({
        name: "",
        description: "",
        address: "",
        city: "",
        country: "",
        lat: "",
        lng: "",
        images: null,
      });
      loadData();
    } catch (err) {
      alert(err.response?.data || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="relative">
      <Navbar />
      <div className="flex p-5 row-auto justify-between">
        <h1 className="text-3xl">โรงเเรมของ {user.name}</h1>
        <button
          className="cursor-pointer text-xl bg-[var(--clorblue)] p-2 text-white rounded-[8px] hover:bg-[var(--hoverblue)] hover:scale-110 transition-all duration-300 ease-in-out"
          onClick={() => setshowput(!showput)}
        >
          เพิ่มโรงแรม
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {hotel &&
          hotel.map((item, index) => (
            <Link
              key={item.id || index}
              to={`/Hotels/${item.id}`}
              className="block"
            >
              <div className="drop-shadow-2xl rounded-3xl group cursor-pointer overflow-hidden">
                {!item.imghotel ? (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-all duration-300 ease-in-out">
                    noimg
                    <div className="flex absolute top-4 right-4 w-[34%] justify-between">
                      <div className="w-10 h-8 bg-white flex justify-center items-center rounded-xl">
                        <FaStar className="text-[#ffd000]" /> 10
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          nav(`/Hotels/edithotel/${item.id}`);
                        }}
                        className="w-10 h-8 bg-[#ff0707] flex justify-center items-center rounded-xl"
                      >
                        <MdEdit className="text-[#ffff]" />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          hotelDelete(item.id);
                        }}
                        className="w-10 h-8 bg-[#ff0707] flex justify-center items-center rounded-xl"
                      >
                        <IoTrashBin className="text-[#ffff]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="h-48 bg-gray-200 bg-cover bg-center flex items-center justify-center group-hover:scale-105 transition-all duration-300 ease-in-out"
                    style={{
                      backgroundImage: `url(http://localhost:5500/upload/rooms/${item.imghotel})`,
                    }}
                  >
                    <div className="flex absolute top-4 right-4 w-[34%] justify-between">
                      <div className="w-10 h-8 bg-white flex justify-center items-center rounded-xl">
                        <FaStar className="text-[#ffd000]" /> 10
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          nav(`/Hotels/edithotel/${item.id}`);
                        }}
                        className="w-10 h-8 bg-[#ff0707] flex justify-center items-center rounded-xl"
                      >
                        <MdEdit className="text-[#ffff]" />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          hotelDelete(item.id);
                        }}
                        className="w-10 h-8 bg-[#ff0707] flex justify-center items-center rounded-xl"
                      >
                        <IoTrashBin className="text-[#ffff]" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-4 bg-white text-black">
                  <h1 className="text-[20px] font-bold group-hover:text-[var(--clorblue)] duration-300">
                    {item.name}
                  </h1>
                  <h2 className="flex items-center">
                    <IoLocationSharp /> {item.city}, {item.country}
                  </h2>
                  <p>{item.description}</p>
                  <p>{item.address}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {showput && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setshowput(false)}
        />
      )}

      {showput && (
        <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 w-[90%] max-w-lg bg-white rounded-2xl p-6 z-51 flex flex-col gap-3 drop-shadow-2xl">
          <h2 className="text-xl font-bold">เพิ่มโรงแรม</h2>

          <input
            className="border rounded-[4px] border-gray-300 p-2"
            name="name"
            onChange={handleChange}
            placeholder="ชื่อโรงแรม"
            value={form.name}
          />
          <textarea
            className="border rounded-[4px] border-gray-300 p-2"
            name="description"
            onChange={handleChange}
            placeholder="คำอธิบาย"
            value={form.description}
          />
          <div className="w-full flex justify-between gap-2">
            <input
              className="border w-[50%] rounded-[4px] border-gray-300 p-2"
              name="address"
              onChange={handleChange}
              placeholder="ที่อยู่"
              value={form.address}
            />
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border w-[50%] rounded-[4px] border-gray-300 p-2"
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
          <input
            className="border rounded-[4px] border-gray-300 p-2"
            name="country"
            onChange={handleChange}
            placeholder="ประเทศ"
            value={form.country}
          />
          <div className="w-full flex justify-between gap-2">
            <input
              className="border w-[49%] rounded-[4px] border-gray-300 p-2"
              name="lat"
              type="number"
              onChange={handleChange}
              placeholder="latitude"
              value={form.lat}
            />
            <input
              className="border w-[49%] rounded-[4px] border-gray-300 p-2"
              name="lng"
              type="number"
              onChange={handleChange}
              placeholder="longitude"
              value={form.lng}
            />
          </div>

          <label className="cursor-pointer border-dashed border-2 border-gray-300 rounded-xl flex flex-col items-center justify-center h-40 overflow-hidden">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <span className="text-4xl">+</span>
                <span className="text-sm">อัพโหลดรูปโรงแรม</span>
              </div>
            )}
            <input
              name="images"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>

          {preview && (
            <button
              onClick={() => {
                setPreview(null);
                setForm((prev) => ({ ...prev, images: null }));
              }}
              className="text-sm text-red-400"
            >
              ลบรูป
            </button>
          )}

          <div className="flex justify-center gap-3 mt-2">
            <button
              className="bg-[var(--clorblue)] text-white w-24 h-10 rounded-[4px] cursor-pointer"
              onClick={handleSubmit}
            >
              ยืนยัน
            </button>
            <button
              className="bg-red-500 text-white w-24 h-10 rounded-[4px] cursor-pointer"
              onClick={() => setshowput(false)}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerHotel;
