import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { booking, checkroom, hotelroomsIndex } from "../funtions/room";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaRegCreditCard } from "react-icons/fa";
import { BsQrCodeScan } from "react-icons/bs";
import { FaMoneyBill } from "react-icons/fa";
import { Sliderimg } from "../funtions/sliderimg";
import Qrcode_Test from "../pages/Qrcode_Test";

const Roomonsub = () => {
  const user = useSelector((state) => state.user.user);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selected, setSelected] = useState("");
  const [guests, setGuests] = useState(1);
  const [firstName, setFirstName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.number);
  const [nights, setNights] = useState(0);
  const params = useParams();
  const [data, setdata] = useState([]);
  const pricePerNight = data.base_price || 0;
  const [showselect, setshowselect] = useState(false);
  const [pendingBook, setPendingBook] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (checkIn && checkOut) {
      const diff =
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
      setNights(diff > 0 ? diff : 0);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    loadData();
  }, []);

  const total = pricePerNight * nights;

  const loadData = async () => {
    hotelroomsIndex(params.idhotel, params.id)
      .then((res) => {
        setdata(res.data);
      })
      .catch((err) => setdata({}));
  };

  const submitBooking = (book) => {
    console.log(book)
    booking(book)
      .then((res) => {
        console.log(res.data);
        alert("จองสำเร็จ!");
        navigate("/listcheck");
      })
      .catch((err) => {
        const message = err.response?.data;
        if (message === "ห้องไม่ว่างในช่วงเวลานี้") {
          alert("ห้องไม่ว่างในช่วงเวลานี้ กรุณาเลือกวันอื่น");
        } else {
          alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        }
      });
  };

  const handleQrConfirm = () => {
    setshowselect(false);
    if (pendingBook) {
      submitBooking(pendingBook);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const book = {
      userid: user.id,
      roomid: params.id,
      check_in: checkIn,
      check_out: checkOut,
      totalp: total,
      status: "pending",
      _met: selected,
    };

    if (selected === "transfer") {
      checkroom(params.id, checkIn, checkOut)
        .then((res) => {
          setPendingBook(book);
          setshowselect(true);
        })
        .catch((err) => {
          const message = err.response?.data;
          if (message === "ห้องไม่ว่างในช่วงเวลานี้") {
            alert("ห้องไม่ว่างในช่วงเวลานี้ กรุณาเลือกวันอื่น");
          }
        });
    } else {
      submitBooking(book);
    }
  };

  return (
    <div className="relative ">
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-5 py-10 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">ยืนยันการจอง</h1>
            <p className="text-gray-500 mt-1">
              กรอกข้อมูลเพื่อยืนยันการจองห้องพักของคุณ
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-5">
                    รายละเอียดการเข้าพัก
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        วันเช็คอิน
                      </label>
                      <input
                        type="date"
                        required
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        วันเช็คเอาท์
                      </label>
                      <input
                        type="date"
                        required
                        value={checkOut}
                        min={checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      จำนวนผู้เข้าพัก
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {Array.from({ length: data.max_guests }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}คน
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-5">
                    ข้อมูลผู้เข้าพัก
                  </h2>

                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        ชื่อ
                      </label>
                      <input
                        type="text"
                        required
                        placeholder=""
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        อีเมล
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Hotelbooking@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        เบอร์โทรศัพท์
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="099-999-999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-5">
                    วิธีชำระเงิน
                  </h2>

                  <div className="flex flex-col mb-4">
                    <div className="flex flex-col m-3 text-lg">
                      <label className="m-3 p-2 flex items-center rounded-[8px] border-1 border-gray-300">
                        <input
                          type="radio"
                          name="choice"
                          value="credit"
                          checked={selected === "credit"}
                          onChange={(e) => setSelected(e.target.value)}
                        />
                        <FaRegCreditCard className="m-2" /> บัตรเครดิต
                      </label>

                      <label className="m-3 flex items-center p-2 rounded-[8px] border-1 border-gray-300">
                        <input
                          type="radio"
                          name="choice"
                          value="transfer"
                          checked={selected === "transfer"}
                          onChange={(e) => setSelected(e.target.value)}
                        />
                        <BsQrCodeScan className="m-2" /> โอนเงิน
                      </label>

                      <label className="m-3 flex items-center p-2 rounded-[8px] border-1 border-gray-300">
                        <input
                          type="radio"
                          name="choice"
                          value="cash"
                          checked={selected === "cash"}
                          onChange={(e) => setSelected(e.target.value)}
                        />
                        <FaMoneyBill className="m-2" />
                        เก็บปลายทาง
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-base transition-colors duration-200"
                >
                  ยืนยันการจอง
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  สรุปการจอง
                </h2>

                <div className="rounded-xl overflow-hidden mb-4 h-40">
                  {!data || !data.images || data.images.length === 0 ? (
                    <div className="rounded-xl overflow-hidden mb-4 h-40 bg-gray-200" />
                  ) : (
                    <Sliderimg images={data.images} />
                  )}
                </div>

                <p className="font-bold text-gray-800">{data.description}</p>
                <p className="text-gray-400 text-sm mb-4">
                  จำนวนผู้พักสูงสุด {data.max_guests}
                </p>

                <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                  <SummaryRow
                    label="เช็คอิน"
                    value={
                      checkIn
                        ? new Date(checkIn).toLocaleDateString("th-TH")
                        : "-"
                    }
                  />
                  <SummaryRow
                    label="เช็คเอาท์"
                    value={
                      checkOut
                        ? new Date(checkOut).toLocaleDateString("th-TH")
                        : "-"
                    }
                  />
                  <SummaryRow label="จำนวนคืน" value={`${nights} คืน`} bold />
                  <SummaryRow label="ผู้เข้าพัก" value={`${guests} คน`} />
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-2">
                  <SummaryRow
                    label={`฿${pricePerNight.toLocaleString()} × ${nights} คืน`}
                    value={`฿${total.toLocaleString()}`}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="font-bold text-blue-500">
                      ยอดรวมทั้งหมด
                    </span>
                    <span className="font-bold text-blue-500 text-lg">
                      ฿{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ QR Modal */}
      {showselect && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setshowselect(false)}
          />
          <div className="relative bg-white w-100 h-100 rounded-2xl">
            <Qrcode_Test amount={total} hid={handleQrConfirm} />
          </div>
        </div>
      )}
    </div>
  );
};

function SummaryRow({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={`text-gray-700 ${bold ? "font-semibold" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default Roomonsub;
