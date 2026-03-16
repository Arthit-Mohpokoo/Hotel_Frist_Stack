import React, { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { customerCheckin, getRoomImages, listto } from "../funtions/room";
import axios from "axios";
import Navbar from "../layout/Navbar";
import { Link } from "react-router-dom";
import { Sliderimg } from "../funtions/sliderimg";
import { review } from "../funtions/auth";

const STATUS_CONFIG = {
  paid: {
    label: "ชำระเงินแล้ว",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
  pending: {
    label: "รอชำระเงิน",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  cancelled: {
    label: "ยกเลิกแล้ว",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    dot: "bg-red-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  completed: {
    label: "เสร็จสิ้น",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex animate-pulse">
    <div className="w-52 min-h-[200px] bg-gray-200 flex-shrink-0" />
    <div className="flex-1 p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="h-4 w-36 bg-gray-100 rounded" />
        </div>
        <div className="h-8 w-28 bg-gray-200 rounded-full" />
      </div>
      <div className="flex gap-8 pt-2">
        <div className="h-4 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-20 bg-gray-100 rounded" />
      </div>
      <div className="border-t border-gray-100 pt-4 flex gap-4">
        <div className="h-4 w-28 bg-gray-100 rounded" />
        <div className="h-4 w-24 bg-gray-100 rounded" />
      </div>
    </div>
  </div>
);

const FilterTab = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
      ${
        active
          ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
          : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
      }`}
  >
    {label}
    {count !== undefined && (
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
        ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
      >
        {count}
      </span>
    )}
  </button>
);

const BookingCard = ({ item, index, onCancel }) => {
  const config = STATUS_CONFIG[item.status] || STATUS_CONFIG["pending"];
  const [showbox, setShowbox] = useState(false);
  const [rating, setRating] = useState(0);

  const [reviewData, setReviewData] = useState({
    userid: item.user_id,
    hotel_id: item.room?.hotel_id,
    rating: 0,
    comment: "",
    booking: item.id,
  });
  
  const handleChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };
  const handleClick = (e, starIndex) => {
    const { left, width } = e.target.getBoundingClientRect();
    const isHalf = e.clientX - left < width / 2;
    const newRating = isHalf ? starIndex - 0.5 : starIndex;
    setRating(newRating); 
    setReviewData({ ...reviewData, rating: newRating });
  };
  const comment = () => {
    console.log(reviewData);
    review(reviewData)
      .then((res) => {
        console.log(res);
        setShowbox(!showbox);
      })
      .catch((err) => {
        alert(err.response?.data || "เกิดข้อผิดพลาด");
        setShowbox(!showbox);
      });
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex hover:shadow-md transition-shadow duration-200"
      style={{ animation: `fadeUp 0.4s ease ${index * 60}ms both` }}
    >
      <div className=" w-52 min-h-[180px] bg-gray-100 flex-shrink-0">
        {item.images?.length > 0 ? (
          <div className="">
            <Sliderimg images={item.images} />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              {item.room?.name || "ห้องพัก"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              หมายเลขการจอง #{item.id}
            </p>
            {item.room?.hotel_id && (
              <Link
                to={`/Hotels/${item.room.hotel_id}`}
                className="text-sm text-blue-500 hover:underline mt-0.5 inline-block"
              >
                ดูโรงแรม →
              </Link>
            )}
          </div>
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
            ${config.bg} ${config.text} ${config.border}`}
          >
            {config.icon}
            {config.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mt-3">
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              เช็คอิน:{" "}
              <span className="text-gray-700 font-medium">
                {formatDate(item.check_in)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              เช็คเอาท์:{" "}
              <span className="text-gray-700 font-medium">
                {formatDate(item.check_out)}
              </span>
            </span>
          </div>
          {item.total_price !== undefined && (
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-blue-600 font-semibold">
                ฿{Number(item.total_price).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {item.status !== "cancelled" && item.status !== "completed" && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onCancel(item.id)}
              className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-xl transition-colors duration-200"
            >
              ยกเลิกการจอง
            </button>
          </div>
        )}
        <div>
          {}
          {item.status === "completed" && (
            <div>
              <button
                onClick={() => setShowbox(!showbox)}
                className="border-blue-500 border text-blue-600 w-25 flex items-center m-3 justify-center rounded-2xl bg-blue-100 cursor-pointer"
              >
                comment
              </button>
            </div>
          )}
        </div>
        {showbox && (
          <div
            className="w-2/3 bg-white shadow-lg rounded-xl absolute flex flex-col gap-3 p-5
                      top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="flex gap-1 text-amber-400 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={(e) => handleClick(e, star)}
                  className="cursor-pointer select-none"
                >
                  {rating >= star ? "★" : rating >= star - 0.5 ? "⯨" : "☆"}
                </span>
              ))}
              <span className="text-sm text-gray-500 self-center ml-2">
                {rating} คะแนน
              </span>
              <span
                onClick={() => setShowbox(!showbox)}
                className="flex justify-end w-[60%] text-red-500"
              >
                x
              </span>
            </div>

            <input
              type="text"
              name="comment"
              value={reviewData.comment}
              onChange={handleChange}
              placeholder="เขียนรีวิว..."
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-300"
            />

            <button
              onClick={comment}
              className="bg-amber-400 hover:bg-amber-500 text-white rounded-lg py-2 font-semibold"
            >
              ส่งรีวิว
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ListCheck = () => {
  const user = useSelector((state) => state.user.user);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loaddata();
  }, []);
  const loaddata = async () => {
    setLoading(true);
    try {
      const res = await customerCheckin(user.id);
      const bookingsData = res.data;

      const roomDetails = await Promise.all(
        bookingsData.map(async (booking) => {
          const roomRes = await listto(booking.room_id);
          const imgRes = await getRoomImages(booking.room_id);
          return { ...booking, room: roomRes.data[0], images: imgRes.data };
        }),
      );

      setBookings(roomDetails);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("ต้องการยกเลิกการจองนี้?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        import.meta.env.VITE_API + `/cancelbooking`,
        { id: bookingId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
    } catch (err) {
      alert("ยกเลิกไม่สำเร็จ");
    }
  };

  const tabs = [
    { key: "all", label: "ทั้งหมด" },
    { key: "pending", label: "รอชำระ" },
    { key: "paid", label: "ชำระแล้ว" },
    { key: "completed", label: "เสร็จสิ้น" },
    { key: "cancelled", label: "ยกเลิก" },
  ];
  const STATUS_ORDER = { pending: 0, paid: 1, completed: 2, cancelled: 3 };
  const filtered = (
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter)
  ).sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99),
  );

  const countByStatus = (key) =>
    key === "all"
      ? bookings.length
      : bookings.filter((b) => b.status === key).length;

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8" style={{ animation: "fadeUp 0.4s ease both" }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            การจองของฉัน
          </h1>
          <p className="text-gray-500 text-sm">
            จัดการและติดตามการจองโรงแรมของคุณ
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2 mb-6"
          style={{ animation: "fadeUp 0.4s ease 60ms both" }}
        >
          {tabs.map((tab) => (
            <FilterTab
              key={tab.key}
              label={tab.label}
              count={countByStatus(tab.key)}
              active={filter === tab.key}
              onClick={() => setFilter(tab.key)}
            />
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filtered.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm"
              style={{ animation: "fadeUp 0.4s ease both" }}
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-gray-700 font-semibold mb-1">ไม่พบการจอง</h3>
              <p className="text-gray-400 text-sm">
                {filter === "all"
                  ? "คุณยังไม่มีการจองโรงแรม"
                  : `ไม่มีการจองในสถานะ "${tabs.find((t) => t.key === filter)?.label}"`}
              </p>
              <Link
                to="/Hotels"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                ค้นหาโรงแรมเลย →
              </Link>
            </div>
          ) : (
            filtered.map((item, index) => (
              <BookingCard
                key={item.id || index}
                item={item}
                index={index}
                onCancel={handleCancel}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ListCheck;
