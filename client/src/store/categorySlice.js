import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.error = null;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    setCategoryError: (state, action) => {
      state.error = action.payload;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.error = null;
    },
  },
});

export const { setCategories, addCategory, setCategoryError, clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
