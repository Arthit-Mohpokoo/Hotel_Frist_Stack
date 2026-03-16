import React, { useEffect, useState } from "react";
import Navbar from "../../layout/Navbar";
import { databook, updatebooking } from "../../funtions/room";
import { useSelector } from "react-redux";

const STATUS_ORDER = { pending: 0, paid: 1, completed: 2, cancelled: 3 };

const STATUS_CONFIG = {
  pending:   { label: "รอชำระ",   bg: "bg-amber-100",   text: "text-amber-700",  dot: "bg-amber-400" },
  paid:      { label: "ชำระแล้ว", bg: "bg-blue-100",    text: "text-blue-700",   dot: "bg-blue-400" },
  completed: { label: "เสร็จสิ้น", bg: "bg-emerald-100", text: "text-emerald-700",dot: "bg-emerald-400" },
  cancelled: { label: "ยกเลิก",   bg: "bg-red-100",     text: "text-red-600",    dot: "bg-red-400" },
};

const tabs = [
  { key: "all",       label: "ทั้งหมด" },
  { key: "pending",   label: "รอชำระ" },
  { key: "paid",      label: "ชำระแล้ว" },
  { key: "completed", label: "เสร็จสิ้น" },
  { key: "cancelled", label: "ยกเลิก" },
];

const MOCK_DATA = [
  { booking_id: 1, hotel_name: "Hotel_stack", room_name: "idoncare", check_in: "2026-03-10", check_out: "2026-03-13", total_price: 15000, status: "paid",      user_id: 1 },
  { booking_id: 2, hotel_name: "Hotel_stack", room_name: "idon't",   check_in: "2026-03-14", check_out: "2026-03-15", total_price: 5000,  status: "pending",   user_id: 1 },
  { booking_id: 3, hotel_name: "school Hotel",room_name: "Deluxe",   check_in: "2026-03-16", check_out: "2026-03-20", total_price: 20000, status: "completed", user_id: 1 },
  { booking_id: 4, hotel_name: "goodboy",     room_name: "Standard", check_in: "2026-03-18", check_out: "2026-03-19", total_price: 3000,  status: "cancelled", user_id: 1 },
];

const formatDate = (d) => {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "2-digit" });
};

const nights = (ci, co) => {
  const diff = new Date(co) - new Date(ci);
  return Math.max(1, Math.round(diff / 86400000));
};

const StatCard = ({ label, value, sub, accent }) => (
  <div className={`rounded-2xl p-5 flex flex-col gap-1 border ${accent}`}>
    <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">{label}</span>
    <span className="text-2xl font-bold text-slate-800">{value}</span>
    {sub && <span className="text-xs text-slate-400">{sub}</span>}
  </div>
);

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    loaddata();
  }, [user]);

  const loaddata = () => {
    setLoading(true);
    databook(user.id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        // fallback mock data for development
        setData(MOCK_DATA);
        setLoading(false);
      });
  };

  const handleUpdate = (bookingId, newStatus) => {
    setUpdating(bookingId);
    updatebooking(bookingId, newStatus)
      .then(() => {
        setData((prev) =>
          prev.map((b) => (b.booking_id === bookingId ? { ...b, status: newStatus } : b))
        );
        setUpdating(null);
      })
      .catch(() => setUpdating(null));
  };

  const filtered = (filter === "all" ? data : data.filter((b) => b.status === filter)).sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
  );

  const totalRevenue = data
    .filter((b) => b.status === "paid" || b.status === "completed")
    .reduce((s, b) => s + Number(b.total_price), 0);

  const countByStatus = (s) => data.filter((b) => b.status === s).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            สวัสดี, {user?.name || "Owner"} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">ภาพรวมการจองโรงแรมของคุณ</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            label="การจองทั้งหมด"
            value={data.length}
            sub="รายการ"
            accent="border-slate-200 bg-white"
          />
          <StatCard
            label="รอชำระ"
            value={countByStatus("pending")}
            sub="รายการ"
            accent="border-amber-200 bg-amber-50"
          />
          <StatCard
            label="รายได้รวม"
            value={`฿${totalRevenue.toLocaleString()}`}
            sub="จากยืนยันแล้ว"
            accent="border-emerald-200 bg-emerald-50"
          />
          <StatCard
            label="ยกเลิก"
            value={countByStatus("cancelled")}
            sub="รายการ"
            accent="border-red-200 bg-red-50"
          />
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {tabs.map((t) => {
            const count = t.key === "all" ? data.length : countByStatus(t.key);
            return (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  filter === t.key
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                }`}
              >
                {t.label}
                {count > 0 && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    filter === t.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
              กำลังโหลด...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <span className="text-4xl mb-3">📭</span>
              <span className="text-sm">ไม่มีรายการ</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">#</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">โรงแรม / ห้อง</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">เช็คอิน</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">เช็คเอาท์</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">ราคา</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">สถานะ</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((b) => {
                    const cfg = STATUS_CONFIG[b.status] || {};
                    return (
                      <tr key={b.booking_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 text-slate-300 font-mono text-xs">#{b.booking_id}</td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-700">{b.hotel_name}</div>
                          <div className="text-xs text-slate-400">{b.room_name}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{formatDate(b.check_in)}</td>
                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(b.check_out)}
                          <div className="text-xs text-slate-400">{nights(b.check_in, b.check_out)} คืน</div>
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-slate-700">
                          ฿{Number(b.total_price).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          {b.status === "pending" && (
                            <div className="flex gap-1.5 justify-center">
                              <button
                                onClick={() => handleUpdate(b.booking_id, "paid")}
                                disabled={updating === b.booking_id}
                                className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                              >
                                ยืนยัน
                              </button>
                              <button
                                onClick={() => handleUpdate(b.booking_id, "cancelled")}
                                disabled={updating === b.booking_id}
                                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          )}
                          {b.status === "paid" && (
                            <button
                              onClick={() => handleUpdate(b.booking_id, "completed")}
                              disabled={updating === b.booking_id}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                              เสร็จสิ้น
                            </button>
                          )}
                          {(b.status === "completed" || b.status === "cancelled") && (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="text-xs text-slate-400 mt-3 text-right">
            แสดง {filtered.length} จาก {data.length} รายการ
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;