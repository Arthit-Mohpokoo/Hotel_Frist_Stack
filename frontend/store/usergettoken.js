import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  value: "getToken",
   user: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = "Signin";
      state.user = action.payload; // ✅ ถูกต้อง
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
