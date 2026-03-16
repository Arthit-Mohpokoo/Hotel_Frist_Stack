import axios from "axios";
import { data } from "react-router-dom";

export const currentUser = (token) => {
  return axios.post(
    "http://localhost:5500/api/current-user",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const listhotel = async (data) => {
  return await axios.get(import.meta.env.VITE_API + "/hotel", data);
};
export const createhotel = async (data) => {
  return await axios.post(import.meta.env.VITE_API + "/hotel", data);
};

export const read = async (id) => {
  return await axios.get(import.meta.env.VITE_API + "/hotel/" + id);
};
export const review = (data) => {
  const token = localStorage.getItem("token")
  return axios.post(
    import.meta.env.VITE_API + "/review",
    data,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
}
