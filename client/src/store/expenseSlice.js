import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.error = null;
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    setExpenseError: (state, action) => {
      state.error = action.payload;
    },
    clearExpenses: (state) => {
      state.expenses = [];
      state.error = null;
    },
  },
});

export const { setExpenses, addExpense, setExpenseError, clearExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
