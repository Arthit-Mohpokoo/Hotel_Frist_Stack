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
    }
  );
};

export const listhotel = async (data)=>{
  return await axios.get(import.meta.env.VITE_API + "/hotel",data)
}
export const read = async (id)=>{
  return await axios.get(import.meta.env.VITE_API + "/hotel/" + id)
}

