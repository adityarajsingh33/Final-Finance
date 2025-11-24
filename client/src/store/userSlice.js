import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    setUserError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setUserError } = userSlice.actions;
export default userSlice.reducer;
