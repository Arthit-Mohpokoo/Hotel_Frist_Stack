import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./usergettoken"

const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export default store;