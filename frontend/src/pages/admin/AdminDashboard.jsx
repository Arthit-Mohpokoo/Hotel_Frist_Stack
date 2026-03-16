import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaChevronCircleRight } from "react-icons/fa";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  getAdminStats,
  getAdminUsers,
  banUser,
  unbanUser,
  changeUserRole,
  deleteUser,
  getAdminHotels,
  adminDeleteHotel,
} from "../../funtions/admin";

const TABS = ["ภาพรวม", "สมาชิก", "โรงแรม"];

const StatCard = ({ label, value, sub, color }) => (
  <div className={`rounded-2xl p-5 border flex flex-col gap-1 ${color}`}>
    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
      {label}
    </span>
    <span className="text-3xl font-bold text-gray-800">{value}</span>
    {sub && <span className="text-xs text-gray-400 mt-0.5">{sub}</span>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}:{" "}
          {p.name === "รายได้"
            ? `฿${Number(p.value).toLocaleString()}`
            : p.value}
        </p>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const user = useSelector((s) => s.user.user);
  const authLoading = useSelector((s) => s.user.loading);
  const nav = useNavigate();
  const [tab, setTab] = useState("ภาพรวม");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [hotelSearch, setHotelSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [chartRange, setChartRange] = useState(12);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      nav("/SingIn");
      return;
    }
    if (user.role !== "admin") nav("/");
  }, [user, authLoading]);

  useEffect(() => {
    if (tab === "ภาพรวม" && !stats) fetchStats();
    if (tab === "สมาชิก" && !users.length) fetchUsers();
    if (tab === "โรงแรม" && !hotels.length) fetchHotels();
  }, [tab]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { data } = await getAdminStats();
      setStats(data);
    } catch {
      showToast("โหลด stats ไม่สำเร็จ", "error");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await getAdminUsers();
      setUsers(data);
    } catch {
      showToast("โหลด users ไม่สำเร็จ", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchHotels = async () => {
    setLoadingHotels(true);
    try {
      const { data } = await getAdminHotels();
      setHotels(data);
    } catch {
      showToast("โหลด hotels ไม่สำเร็จ", "error");
    } finally {
      setLoadingHotels(false);
    }
  };

  const handleBan = async (id, isBanned) => {
    try {
      if (isBanned) await unbanUser(id);
      else await banUser(id);
      setUsers((p) =>
        p.map((u) => (u.id === id ? { ...u, is_banned: isBanned ? 0 : 1 } : u)),
      );
      showToast(isBanned ? "ปลดแบนสำเร็จ" : "แบนสำเร็จ");
    } catch (err) {
      showToast(err?.response?.data?.message || "เกิดข้อผิดพลาด", "error");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("ยืนยันลบ user นี้?")) return;
    try {
      await deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
      showToast("ลบ user สำเร็จ");
    } catch (err) {
      showToast(err?.response?.data?.message || "เกิดข้อผิดพลาด", "error");
    }
  };

  const handleChangeRole = async (id, role) => {
    try {
      await changeUserRole(id, role);
      setUsers((p) => p.map((u) => (u.id === id ? { ...u, role } : u)));
      showToast("เปลี่ยน role สำเร็จ");
    } catch (err) {
      showToast(err?.response?.data?.message || "เกิดข้อผิดพลาด", "error");
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!confirm("ยืนยันลบโรงแรมนี้?")) return;
    try {
      await adminDeleteHotel(id);
      setHotels((p) => p.filter((h) => h.id !== id));
      showToast("ลบโรงแรมสำเร็จ");
    } catch (err) {
      showToast(err?.response?.data?.message || "เกิดข้อผิดพลาด", "error");
    }
  };

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, userSearch]);

  const filteredHotels = useMemo(() => {
    const q = hotelSearch.toLowerCase();
    if (!q) return hotels;
    return hotels.filter(
      (h) =>
        h.name.toLowerCase().includes(q) || h.city?.toLowerCase().includes(q),
    );
  }, [hotels, hotelSearch]);

  const chartData = useMemo(() => {
    if (!stats?.monthly) return [];
    const all = stats.monthly.map((m) => ({
      month: m.month.slice(5),
      fullMonth: m.month,
      การจอง: Number(m.bookings),
      รายได้: Number(m.revenue),
    }));

    return all.slice(-chartRange);
  }, [stats, chartRange]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
          ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}
        >
          {toast.msg}
        </div>
      )}

      <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center justify-between w-full m-2 sticky top-0 z-40">
          <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Hotel Stack Management</p>
        </div>
        <span className="text-xs bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
          admin
        </span>
        </div>
        
        <span onClick={()=>nav('/')} className="text-xl flex text- font-bold px-3 py-1.5 rounded-full uppercase tracking-wide cursor-pointer hover:text-[var(--clorblue)] ">
          <FaChevronCircleRight className="mt-1 mr-1" /> Home
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${tab === t ? "bg-[var(--clorblue)] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "ภาพรวม" &&
          (loadingStats ? (
            <p className="text-center py-20 text-gray-400 text-sm">
              กำลังโหลด...
            </p>
          ) : (
            stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    label="สมาชิกทั้งหมด"
                    value={stats.summary.total_users}
                    color="border-blue-100 bg-blue-50"
                  />
                  <StatCard
                    label="โรงแรม"
                    value={stats.summary.total_hotels}
                    color="border-purple-100 bg-purple-50"
                  />
                  <StatCard
                    label="การจองทั้งหมด"
                    value={stats.summary.total_bookings}
                    sub={`ยืนยัน ${stats.summary.confirmed} · ยกเลิก ${stats.summary.cancelled}`}
                    color="border-amber-100 bg-amber-50"
                  />
                  <StatCard
                    label="รายได้รวม"
                    value={`฿${Number(stats.summary.total_revenue).toLocaleString()}`}
                    sub={`รอดำเนินการ ${stats.summary.pending} รายการ`}
                    color="border-emerald-100 bg-emerald-50"
                  />
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-sm font-semibold text-gray-600 mb-4">
                    สัดส่วนสถานะการจอง
                  </h2>
                  {stats.summary.total_bookings > 0 && (
                    <>
                      <div className="flex gap-1 h-4 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: `${(stats.summary.confirmed / stats.summary.total_bookings) * 100}%`,
                          }}
                          className="bg-emerald-400"
                        />
                        <div
                          style={{
                            width: `${(stats.summary.pending / stats.summary.total_bookings) * 100}%`,
                          }}
                          className="bg-amber-400"
                        />
                        <div
                          style={{
                            width: `${(stats.summary.cancelled / stats.summary.total_bookings) * 100}%`,
                          }}
                          className="bg-red-400"
                        />
                      </div>
                      <div className="flex gap-6 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                          ยืนยัน {stats.summary.confirmed}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                          รอดำเนินการ {stats.summary.pending}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                          ยกเลิก {stats.summary.cancelled}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* กราฟรายเดือน */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-semibold text-gray-600">
                      รายได้ & การจองรายเดือน
                    </h2>
                    <div className="flex gap-1">
                      {[3, 6, 12].map((r) => (
                        <button
                          key={r}
                          onClick={() => setChartRange(r)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all
                            ${
                              chartRange === r
                                ? "bg-[var(--clorblue)] text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                        >
                          {r} เดือน
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 4, right: 24, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar
                        yAxisId="left"
                        dataKey="การจอง"
                        fill="#93c5fd"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        dataKey="รายได้"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Top 10 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="text-sm font-semibold text-gray-600 mb-4">
                      🏆 Top 10 จองมากสุด
                    </h2>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-50">
                          <th className="pb-2 text-left font-medium w-6">#</th>
                          <th className="pb-2 text-left font-medium">โรงแรม</th>
                          <th className="pb-2 text-right font-medium">
                            การจอง
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {stats.topBooked.map((h, i) => (
                          <tr key={h.id}>
                            <td className="py-2.5 text-gray-400 font-mono">
                              {i + 1}
                            </td>
                            <td className="py-2.5">
                              <p className="font-medium text-gray-800">
                                {h.name}
                              </p>
                              <p className="text-gray-400 text-[11px]">
                                {h.city}
                              </p>
                            </td>
                            <td className="py-2.5 text-right font-bold text-blue-500">
                              {h.total_bookings}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="text-sm font-semibold text-gray-600 mb-4">
                      💰 Top 10 รายได้สูงสุด
                    </h2>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-50">
                          <th className="pb-2 text-left font-medium w-6">#</th>
                          <th className="pb-2 text-left font-medium">โรงแรม</th>
                          <th className="pb-2 text-right font-medium">
                            รายได้
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {stats.topRevenue.map((h, i) => (
                          <tr key={h.id}>
                            <td className="py-2.5 text-gray-400 font-mono">
                              {i + 1}
                            </td>
                            <td className="py-2.5">
                              <p className="font-medium text-gray-800">
                                {h.name}
                              </p>
                              <p className="text-gray-400 text-[11px]">
                                {h.city}
                              </p>
                            </td>
                            <td className="py-2.5 text-right font-bold text-emerald-600">
                              ฿{Number(h.total_revenue).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          ))}

        {/* ══ สมาชิก ══ */}
        {tab === "สมาชิก" &&
          (loadingUsers ? (
            <p className="text-center py-20 text-gray-400 text-sm">
              กำลังโหลด...
            </p>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="ค้นหาชื่อ / email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["ID", "ชื่อ", "Email", "Role", "สถานะ", "จัดการ"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-4 text-gray-400 font-mono text-xs">
                          {u.id}
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {u.name}
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs">
                          {u.email}
                        </td>
                        <td className="px-5 py-4">
                          {u.role === "admin" ? (
                            <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-1 rounded-full">
                              admin
                            </span>
                          ) : (
                            <select
                              value={u.role || u.null}
                              onChange={(e) =>
                                handleChangeRole(u.id, e.target.value)
                              }
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1 cursor-pointer"
                            >
                              <option value="customer">customer</option>
                              <option value="hotel_owner">hotel_owner</option>
                            </select>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full
                              ${u.is_banned ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
                          >
                            {u.is_banned ? "แบน" : "ปกติ"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {u.role !== "admin" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleBan(u.id, u.is_banned)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all
                                    ${u.is_banned ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-amber-50 text-amber-600 hover:bg-amber-100"}`}
                              >
                                {u.is_banned ? "ปลดแบน" : "แบน"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                              >
                                ลบ
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filteredUsers.length && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    ไม่พบสมาชิก
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* ══ โรงแรม ══ */}
        {tab === "โรงแรม" &&
          (loadingHotels ? (
            <p className="text-center py-20 text-gray-400 text-sm">
              กำลังโหลด...
            </p>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="ค้นหาชื่อโรงแรม / เมือง..."
                value={hotelSearch}
                onChange={(e) => setHotelSearch(e.target.value)}
                className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {[
                        "ID",
                        "ชื่อโรงแรม",
                        "เมือง",
                        "เจ้าของ",
                        "การจอง",
                        "จัดการ",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredHotels.map((h) => (
                      <tr
                        key={h.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-4 text-gray-400 font-mono text-xs">
                          {h.id}
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {h.name}
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs">
                          {h.city}, {h.country}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-700 text-xs">
                            {h.owner_name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {h.owner_email}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-blue-500">
                            {h.total_bookings}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleDeleteHotel(h.id)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filteredHotels.length && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    ไม่พบโรงแรม
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
