import axios from "axios";

// Base URL sourced from environment configuration
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Axios instance for authenticated API calls
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export class ExpenseService {
  /**
   * Creates a new expense entry
   * @param {Object} payload
   * @param {number} payload.amount - Expense amount
   * @param {string} payload.categoryId - Category identifier
   * @param {string} payload.note - Additional note for the expense
   * @returns {Promise<Object>} Newly created expense or error
   */
  async createExpense({ amount, categoryId, note }) {
    try {
      // Submitting expense data to backend
      const response = await api.post("/api/expense/", { amount, categoryId, note });
      return response;
    } catch (error) {
      console.log("ExpenseService :: createExpense :: error ::", error);
      return error;
    }
  }

  /**
   * Fetches all expenses with optional filters
   * @param {Object} filters - Optional query params
   * @returns {Promise<Object>} Expense list or error
   */
  async getAllExpenses(filters = {}) {
    try {
      // Generating query params dynamically
      const queryString = Object.keys(filters)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
        .join("&");

      // Selecting appropriate URL based on filters
      const url = queryString ? `/api/expense/?${queryString}` : "/api/expense/";

      const response = await api.get(url);
      return response;
    } catch (error) {
      console.log("ExpenseService :: getAllExpenses :: error ::", error);
      return error;
    }
  }

  /**
   * Retrieves a single expense by ID
   * @param {string} id - Expense identifier
   * @returns {Promise<Object>} Expense details or error
   */
  async getExpenseById(id) {
    try {
      // Fetching expense detail for given ID
      const response = await api.get(`/api/expense/${id}`);
      return response;
    } catch (error) {
      console.log("ExpenseService :: getExpenseById :: error ::", error);
      return error;
    }
  }

  /**
   * Updates an existing expense entry
   * @param {string} id - Expense ID
   * @param {Object} payload
   * @param {number} payload.amount - Updated amount
   * @param {string} payload.categoryId - Updated category
   * @param {string} payload.note - Updated note
   * @returns {Promise<Object>} Updated expense or error
   */
  async updateExpenseById(id, { amount, categoryId, note }) {
    try {
      // Submitting updated expense data
      const response = await api.put(`/api/expense/${id}`, { amount, categoryId, note });
      return response;
    } catch (error) {
      console.log("ExpenseService :: updateExpenseById :: error ::", error);
      return error;
    }
  }

  /**
   * Deletes an expense by ID
   * @param {string} id - Expense identifier
   * @returns {Promise<Object>} Deletion result or error
   */
  async deleteExpenseById(id) {
    try {
      // Triggering deletion of the specified expense
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
