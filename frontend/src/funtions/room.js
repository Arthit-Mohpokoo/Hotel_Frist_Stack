import axios from "axios";
import { data } from "react-router-dom";

export const hotelrooms = async (idhotel) => {
  return (  await axios.get(import.meta.env.VITE_API + `/hotel/rooms/${idhotel}/all`))
}
export const customerCheckin =async(id)=>{
  return( await axios.get(import.meta.env.VITE_API+'/checkbook/'+id))
}



export const hotelroomsIndex = async (idhotel,id) => {
  return (  await axios.get(import.meta.env.VITE_API + `/hotel/rooms/${idhotel}/${id}`))
}

export const booking = async (data) => {
  const token = localStorage.getItem("token");
  return await axios.post(import.meta.env.VITE_API + `/booking`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const checkroom = async(roomid, datein, dateout)=>{
  return(await axios.post(import.meta.env.VITE_API +`/roomcheck`,{roomid, datein, dateout}))
}
export const listto = async(room_id)=>{
  return(await axios.post(import.meta.env.VITE_API +`/listto`,{id:room_id}))
}

export const getRoomImages = async (room_id) => {
  return (await axios.post(import.meta.env.VITE_API + `/roomimages`, { id: room_id }))
}

export const cancelBooking = async (booking_id) => {
  const token = localStorage.getItem("token");
  return await axios.post(import.meta.env.VITE_API + `/cancelbooking`, { id: booking_id }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};