import { createSlice, configureStore } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'counter',
  initialState: {
    value: "getToken"
  },
  reducers: {
    login: state => {
     state = "Get Token"
    },
    logout: state => {
      state.value = "Delete Token"
    }
  }
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer;
