import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../store/usergettoken"

const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export default store;