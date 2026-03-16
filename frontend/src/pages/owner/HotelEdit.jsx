import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../layout/Navbar"
import { IoLocationSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { hoteledit, hotelread } from "../../funtions/room";

const HotelEdit = () => {
  const params = useParams();
  const nav = useNavigate();
  const user = useSelector((state) => state.user.user);
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    hotelread(params.id)
      .then((res) => {
        const d = res.data;
        setForm({
          name: d.name || "",
          description: d.description || "",
          address: d.address || "",
          city: d.city || "",
          country: d.country || "",
          lat: d.lat || "",
          lng: d.lng || "",
          images: null,
        });
        if (d.imghotel) {
          setPreview(`http://localhost:5500/upload/rooms/${d.imghotel}`);
        }
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

      await hoteledit(params.id, formData);
      alert("แก้ไขโรงแรมเรียบร้อยแล้ว!");
      nav(-1);
    } catch (err) {
      console.log(err);
      alert(err.response?.data || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="relative w-full h-52 overflow-hidden">
        {preview ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${preview})` }}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-400">
            ยังไม่มีรูปโรงแรม
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6 text-white">
          <h1 className="text-3xl font-bold">{form.name || "ชื่อโรงแรม"}</h1>
          <div className="flex items-center gap-1 mt-1 text-sm">
            <IoLocationSharp />
            <span>{form.city || "เมือง"}, {form.country || "ประเทศ"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">

          <h2 className="text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
            <MdEdit /> แก้ไขข้อมูลโรงแรม
          </h2>


          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">ชื่อโรงแรม</label>
            <input
              className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ชื่อโรงแรม"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">คำอธิบาย</label>
            <textarea
              className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all resize-none"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="คำอธิบายโรงแรม"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-gray-500">ที่อยู่</label>
              <input
                className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="ที่อยู่"
              />
            </div>
            <div className="flex flex-col gap-1 w-36">
              <label className="text-sm text-gray-500">เมือง</label>
              <input
                className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="เมือง"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">ประเทศ</label>
            <input
              className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="ประเทศ"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-gray-500">Latitude</label>
              <input
                className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all"
                name="lat"
                type="number"
                value={form.lat}
                onChange={handleChange}
                placeholder="latitude"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-gray-500">Longitude</label>
              <input
                className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all"
                name="lng"
                type="number"
                value={form.lng}
                onChange={handleChange}
                placeholder="longitude"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">รูปโรงแรม</label>
            <label className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-[var(--clorblue)] rounded-xl overflow-hidden h-44 flex items-center justify-center transition-all">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <span className="text-4xl">+</span>
                  <span className="text-sm">คลิกเพื่ออัพโหลดรูป</span>
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
            {form.images && (
              <button
                onClick={() => {
                  setPreview(null);
                  setForm((prev) => ({ ...prev, images: null }));
                }}
                className="text-sm text-red-400 text-left"
              >
                ลบรูป
              </button>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button
              onClick={() => nav(-1)}
              className="px-6 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition-all cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl bg-[var(--clorblue)] hover:bg-[var(--hoverblue)] text-white font-medium transition-all hover:scale-105 cursor-pointer"
            >
              บันทึก
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelEdit;