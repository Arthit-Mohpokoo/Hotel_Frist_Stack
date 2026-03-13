import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  value: "getToken",
   user: [],
   loading:true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = "Signin";
      state.user = action.payload;
      state.loading = false
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoading:(state,action)=>{
      state.loading = action.payload
    }
  },
});

export const { login, logout,setLoading } = userSlice.actions;
export default userSlice.reducer;
