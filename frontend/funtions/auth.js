import axios from "axios";

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