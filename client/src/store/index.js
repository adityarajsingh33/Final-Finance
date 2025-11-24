import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import expenseReducer from "./expenseSlice";
import categoryReducer from "./categorySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    expense: expenseReducer,
    category: categoryReducer,
  },
});

export default store;
