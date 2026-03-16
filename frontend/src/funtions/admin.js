import axios from "axios";

const API = import.meta.env.VITE_API;
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAdminStats = () =>
  axios.get(`${API}/admin/stats`, authHeader());
export const getAdminUsers = () =>
  axios.get(`${API}/admin/users`, authHeader());
export const banUser = (id) =>
  axios.put(`${API}/admin/users/${id}/ban`, {}, authHeader());
export const unbanUser = (id) =>
  axios.put(`${API}/admin/users/${id}/unban`, {}, authHeader());
export const changeUserRole = (id, role) =>
  axios.put(`${API}/admin/users/${id}/role`, { role }, authHeader());
export const deleteUser = (id) =>
  axios.delete(`${API}/admin/users/${id}`, authHeader());
export const getAdminHotels = () =>
  axios.get(`${API}/admin/hotels`, authHeader());
export const adminDeleteHotel = (id) =>
  axios.delete(`${API}/admin/hotels/${id}`, authHeader());
