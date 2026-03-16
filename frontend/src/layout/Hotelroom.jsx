import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { read } from "../funtions/auth";
import { createRoom, hotelrooms, roomDelete } from "../funtions/room";
import Navbar from "./Navbar";
import { FaUsers, FaStar } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { Sliderimg } from "../funtions/sliderimg";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";

const Hotelroom = () => {
  const [data, setData] = useState({});
  const [data2, setdata2] = useState([]);
  const [roomc, setroomc] = useState(false);
  const params = useParams();
  const user = useSelector((state) => state.user.user);
  const [roomForm, setRoomForm] = useState({
    name: "",
    description: "",
    max_guests: "",
    base_price: "",
  });
  const [roomFiles, setRoomFiles] = useState([]);
  const [roomPreviews, setRoomPreviews] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    read(params.id)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
    hotelrooms(params.id)
      .then((res) => setdata2(res.data))
      .catch((err) => {
        setdata2([]);
        console.log(err);
      });
  };

  const handleRoomChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const existing = roomFiles.length;
      const canAdd = 5 - existing;
      if (canAdd <= 0) return alert("เพิ่มรูปได้สูงสุด 5 รูป");
      const selected = Array.from(files).slice(0, canAdd);
      setRoomFiles((prev) => [...prev, ...selected]);
      setRoomPreviews((prev) => [
        ...prev,
        ...selected.map((f) => URL.createObjectURL(f)),
      ]);
    } else {
      setRoomForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeRoomPreview = (i) => {
    setRoomFiles((prev) => prev.filter((_, idx) => idx !== i));
    setRoomPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleRoomSubmit = async () => {
    console.log("roomFiles:", roomFiles);
    console.log("roomFiles length:", roomFiles.length);
    try {
      const formData = new FormData();
      formData.append("idhotel", data.id);
      formData.append("name", roomForm.name);
      formData.append("description", roomForm.description);
      formData.append("max_guests", roomForm.max_guests);
      formData.append("base_price", roomForm.base_price);
      roomFiles.forEach((f) => formData.append("images", f));

      await createRoom(formData);
      alert("สร้างห้องสำเร็จ!");
      setroomc(false);
      setRoomForm({
        name: "",
        description: "",
        max_guests: "",
        base_price: "",
      });
      setRoomFiles([]);
      setRoomPreviews([]);
      window.location.reload();
      loadData();
    } catch (err) {
      alert(err.response?.data || "เกิดข้อผิดพลาด");
    }
  };

  const deleteall = (id) => {
    if (!confirm("คุณแน่ใจที่จะลบ?")) return;
    roomDelete(id)
      .then(() => loadData())
      .catch((err) => {
        console.log(err);
        alert("ลบผิดพลาด");
      });
  };

  const canBook = user?.role === "customer";

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Navbar />

      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        {data.imghotel ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(http://localhost:5500/upload/rooms/${data.imghotel})`,
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-400 text-xl">
            ไม่มีรูปโรงแรม
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow">
            {data.name}
          </h1>
          <div className="flex items-center gap-1 mt-2 text-lg">
            <IoLocationSharp />
            <span>
              {data.city}, {data.country}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <FaStar key={i} className="text-[#ffd000] text-sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <h2 className="text-xl font-bold mb-2 text-[#1a1a2e]">
              เกี่ยวกับโรงแรม
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {data.description || "ไม่มีคำอธิบาย"}
            </p>
            <div className="flex items-start gap-2 mt-4 text-gray-500">
              <IoLocationSharp className="mt-1 shrink-0 text-[var(--clorblue)]" />
              <span>{data.address}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold text-[#1a1a2e]">
              ห้องที่มีให้บริการ
            </h2>
            {user && data.owner_id === user.id && (
              <button
                onClick={() => setroomc(!roomc)}
                className="flex items-center justify-center text-[var(--hoverblue)] cursor-pointer hover:bg-[#b2f1fc] rounded-full w-7 h-7 hover:w-9 hover:h-9 transition-all duration-300"
              >
                <FaPlus />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {data2 && data2.length > 0 ? (
              data2.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row"
                >
                  <div className="sm:w-56 h-44 sm:h-auto shrink-0 overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <div className="relative h-full">
                        <Sliderimg images={item.images} />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        ไม่มีรูป
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between p-4 flex-1">
                    <div>
                      <h3 className="text-lg font-bold text-[#1a1a2e]">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                        <FaUsers className="text-[var(--clorblue)]" />
                        <span>รองรับ {item.max_guests} คน</span>
                      </div>
                    </div>
                    <div className="flex items-end mt-4 justify-between">
                      <div className="flex relative bg-amber-200 justify-start items-start w-[45%]">
                        <span className="text-2xl font-bold text-[var(--clorblue)]">
                          ฿{Number(item.base_price).toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm ml-1 mt-2">
                          /คืน
                        </span>
                      </div>
                      {canBook ? (
                        <Link
                          to={`/Hotels/rooms/${data.id}/${item.id}`}
                          className="bg-[var(--clorblue)] hover:bg-[var(--hoverblue)] text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                        >
                          จองเลย
                        </Link>
                      ) : (
                        <button
                          onClick={() => alert("กรุณาเข้าสู่ระบบก่อนจอง")}
                          className="bg-[var(--clorblue)] hover:bg-[var(--hoverblue)] text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                        >
                          จองเลย
                        </button>
                      )}
                      {user && data.owner_id === user.id && (
                        <div className="flex">
                          <Link
                            to={`/Hotels/editroom/${data.id}/${item.id}`}
                            className="bg-[#f90] hover:bg-[#e68a00] ml-3 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                          >
                            แก้ไขห้อง
                          </Link>
                          <button
                            onClick={() => deleteall(item.id)}
                            className="bg-[#f00] hover:bg-[#b42a2a] ml-3 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                          >
                            ลบ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm">
                ไม่มีห้องว่างในขณะนี้
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold mt-8 mb-3 text-[#1a1a2e]">
            รีวิวจากผู้เข้าพัก
          </h2>
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm">
            ยังไม่มีรีวิว
          </div>
        </div>

        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-4">
            <h3 className="font-bold text-lg text-[#1a1a2e] mb-1">
              {data.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
              <IoLocationSharp className="text-[var(--clorblue)]" />
              <span>
                {data.city}, {data.country}
              </span>
            </div>
            <div className="w-full h-0.5 bg-gray-100 mb-3" />
            <p className="text-sm text-gray-500 mb-3">
              เลือกห้องด้านซ้ายเพื่อดูราคาและจองได้เลย
            </p>
            <div className="bg-[#f0f7ff] rounded-xl p-3 text-center">
              <span className="text-xs text-gray-500">จำนวนห้อง</span>
              <p className="text-2xl font-bold text-[var(--clorblue)]">
                {data2.length}
              </p>
              <span className="text-xs text-gray-400">ห้อง</span>
            </div>
          </div>
        </div>
      </div>

      {roomc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-lg bg-white rounded-2xl p-6 flex flex-col gap-3 drop-shadow-2xl">
            <h2 className="text-xl font-bold">เพิ่มห้องใหม่</h2>
            <input
              className="border rounded-[4px] border-gray-300 p-2"
              name="name"
              onChange={handleRoomChange}
              placeholder="ชื่อห้อง"
              value={roomForm.name}
            />
            <textarea
              className="border rounded-[4px] border-gray-300 p-2"
              name="description"
              onChange={handleRoomChange}
              placeholder="คำอธิบายห้อง"
              value={roomForm.description}
            />
            <div className="w-full flex justify-between gap-2">
              <input
                className="border w-[49%] rounded-[4px] border-gray-300 p-2"
                name="max_guests"
                type="number"
                onChange={handleRoomChange}
                placeholder="รองรับสูงสุด (คน)"
                value={roomForm.max_guests}
              />
              <input
                className="border w-[49%] rounded-[4px] border-gray-300 p-2"
                name="base_price"
                type="number"
                onChange={handleRoomChange}
                placeholder="ราคา / คืน (฿)"
                value={roomForm.base_price}
              />
            </div>

            <div className="grid grid-cols-5 gap-1">
              {roomPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative h-16 rounded-lg overflow-hidden"
                >
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeRoomPreview(i)}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {roomFiles.length < 5 && (
                <label className="h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-[var(--clorblue)] flex items-center justify-center cursor-pointer transition-all">
                  <span className="text-2xl text-gray-400">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleRoomChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex justify-center gap-3 mt-2">
              <button
                className="bg-[var(--clorblue)] text-white w-24 h-10 rounded-[4px] cursor-pointer"
                onClick={handleRoomSubmit}
              >
                ยืนยัน
              </button>
              <button
                className="bg-red-500 text-white w-24 h-10 rounded-[4px] cursor-pointer"
                onClick={() => setroomc(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotelroom;
