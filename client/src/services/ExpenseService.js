import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export class ExpenseService {
  // Create a new expense with body data
  async createExpense({ amount, categoryId, note }) {
    try {
      const response = await api.post("/api/expense/", { amount, categoryId, note });
      return response;
    } catch (error) {
      console.log("ExpenseService :: createExpense :: error ::", error);
      return error;
    }
  }

  // Create a new expense without body data (empty request)
  async getAllExpenses(filters = {}) {
    try {
      // Build query string from filters object
      const queryString = Object.keys(filters)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
        .join("&");
  
      const url = queryString ? `/api/expense/?${queryString}` : "/api/expense/";
  
      const response = await api.get(url);
      return response;
    } catch (error) {
      console.log("ExpenseService :: getAllExpenses :: error ::", error);
      return error;
    }
  }
  

  // Fetch a single expense by id
  async getExpenseById(id) {
    try {
      const response = await api.get(`/api/expense/${id}`);
      return response;
    } catch (error) {
      console.log("ExpenseService :: getExpenseById :: error ::", error);
      return error;
    }
  }

  // Update an existing expense by id
  async updateExpenseById(id, { amount, categoryId, note }) {
    try {
      const response = await api.put(`/api/expense/${id}`, { amount, categoryId, note });
      return response;
    } catch (error) {
      console.log("ExpenseService :: updateExpenseById :: error ::", error);
      return error;
    }
  }

  // Update an existing expense by id
  async deleteExpenseById(id) {
    try {
      const response = await api.delete(`/api/expense/${id}`, {});
      return response;
    } catch (error) {
      console.log("ExpenseService :: deleteExpenseById :: error ::", error);
      return error;
    }
  }
}

// Export single instance
const expenseService = new ExpenseService();
export default expenseService;
