import axios from "axios";
//room
export const hotelrooms = async (idhotel) => {
  return await axios.get(
    import.meta.env.VITE_API + `/hotel/rooms/${idhotel}/all`,
  );
};
export const createRoom = async (formData) => {
  const token = localStorage.getItem("token");
  return await axios.post(import.meta.env.VITE_API + `/hotel/rooms`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const hotelroomsIndex = async (idhotel, id) => {
  return await axios.get(
    import.meta.env.VITE_API + `/hotel/rooms/${idhotel}/${id}`,
  );
};
export const roomDelete = async (id) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    import.meta.env.VITE_API + `/hotel/rooms/delete`,
    { id },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};
export const editRoom = async (id, formData) => {
  const token = localStorage.getItem("token");
  return await axios.put(
    import.meta.env.VITE_API + `/hotel/rooms/${id}`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

//hotel
export const hotelread = async (id) => {
  const token = localStorage.getItem("token");
  return await axios.get(import.meta.env.VITE_API + `/hotel/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const hoteledit = async (id, formData) => {
  const token = localStorage.getItem("token");
  return await axios.put(import.meta.env.VITE_API + `/hotel/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const hotelcreate = async (formData) => {
  const token = localStorage.getItem("token");
  return await axios.post(import.meta.env.VITE_API + `/hotel`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listHotelid = async (id) => {
  return await axios.get(import.meta.env.VITE_API + `/hotelmanager/${id}`);
};
export const removeHotel = async (id) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    import.meta.env.VITE_API + `/hotel/delete`,
    { id },
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export const customerCheckin = async (id) => {
  return await axios.get(import.meta.env.VITE_API + "/checkbook/" + id);
};
export const booking = async (data) => {
  const token = localStorage.getItem("token");
  return await axios.post(import.meta.env.VITE_API + `/booking`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const checkroom = async (roomid, datein, dateout) => {
  return await axios.post(import.meta.env.VITE_API + `/roomcheck`, {
    roomid,
    datein,
    dateout,
  });
};
export const listto = async (room_id) => {
  return await axios.post(import.meta.env.VITE_API + `/listto`, {
    id: room_id,
  });
};

export const getRoomImages = async (room_id) => {
  return await axios.post(import.meta.env.VITE_API + `/roomimages`, {
    id: room_id,
  });
};

export const cancelBooking = async (booking_id) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    import.meta.env.VITE_API + `/cancelbooking`,
    { id: booking_id },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};
