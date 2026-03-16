import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { MdEdit } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { editRoom, hotelroomsIndex } from "../../funtions/room";

const RoomEdit = () => {
  const { hotelId, roomId } = useParams();
  const nav = useNavigate();

  const [existingImages, setExistingImages] = useState([]);
  const [deleteIds, setDeleteIds] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    max_guests: "",
    base_price: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    hotelroomsIndex(hotelId, roomId)
      .then((res) => {
        const d = res.data;
        setForm({
          name: d.name || "",
          description: d.description || "",
          max_guests: d.max_guests || "",
          base_price: d.base_price || "",
        });
        if (d.images?.length) setExistingImages(d.images);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const remain = existingImages.length - deleteIds.length;
    const canAdd = 5 - remain - newFiles.length;
    if (files.length > canAdd) return alert(`เพิ่มได้อีกแค่ ${canAdd} รูป`);
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const markDelete = (id) => setDeleteIds((prev) => [...prev, id]);
  const unmarkDelete = (id) =>
    setDeleteIds((prev) => prev.filter((i) => i !== id));
  const removeNewFile = (i) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("idhotel", hotelId);
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("max_guests", form.max_guests);
      formData.append("base_price", form.base_price);
      if (deleteIds.length)
        formData.append("delete_images", JSON.stringify(deleteIds));
      newFiles.forEach((f) => formData.append("images", f));

      await editRoom(roomId, formData);
      alert("แก้ไขห้องเรียบร้อยแล้ว!");
      nav(-1);
    } catch (err) {
      alert(err.response?.data || "เกิดข้อผิดพลาด");
    }
  };

  const totalImages = existingImages.length - deleteIds.length + newFiles.length;
  const BASE = import.meta.env.VITE_API;

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">

          <h2 className="text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
            <MdEdit /> แก้ไขข้อมูลห้อง
          </h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">ชื่อห้อง</label>
            <input
              className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ชื่อห้อง"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">คำอธิบาย</label>
            <textarea
              className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all resize-none"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="คำอธิบายห้อง"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-gray-500 flex items-center gap-1">
                <FaUsers /> รองรับสูงสุด (คน)
              </label>
              <input
                className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all"
                name="max_guests"
                type="number"
                value={form.max_guests}
                onChange={handleChange}
                placeholder="จำนวนคน"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-gray-500">ราคา / คืน (฿)</label>
              <input
                className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[var(--clorblue)] transition-all"
                name="base_price"
                type="number"
                value={form.base_price}
                onChange={handleChange}
                placeholder="ราคา"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">
              รูปห้อง ({totalImages}/5)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">

              {existingImages.map((img) => {
                const isDeleted = deleteIds.includes(img.id);
                return (
                  <div
                    key={img.id}
                    className="relative h-24 rounded-xl overflow-hidden"
                  >
                    <img
                      src={`${BASE}/upload/rooms/${img.image_url}`}
                      className={`w-full h-full object-cover transition-all ${isDeleted ? "opacity-30" : ""}`}
                    />
                    {isDeleted ? (
                      <button
                        onClick={() => unmarkDelete(img.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs"
                      >
                        ยกเลิก
                      </button>
                    ) : (
                      <button
                        onClick={() => markDelete(img.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}

              {newPreviews.map((src, i) => (
                <div
                  key={`new-${i}`}
                  className="relative h-24 rounded-xl overflow-hidden"
                >
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeNewFile(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {totalImages < 5 && (
                <label className="h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-[var(--clorblue)] flex items-center justify-center cursor-pointer transition-all">
                  <span className="text-3xl text-gray-400">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
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

export default RoomEdit;