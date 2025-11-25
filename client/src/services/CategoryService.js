import axios from "axios";

// Base URL sourced from environment config
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Preconfigured Axios instance for authorized API interactions
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export class CategoryService {
  /**
   * Creates a new category
   * @param {Object} param0
   * @param {string} param0.name - Name of the category
   * @returns {Promise<Object>} The API response or error
   */
  async createCategory({ name }) {
    try {
      // Sending new category data to backend
      const response = await api.post("/api/category/", { name });
      return response;
    } catch (error) {
      console.log("CategoryService :: createCategory :: error ::", error);
      return error;
    }
  }

  /**
   * Fetches all categories
   * @returns {Promise<Object>} List of categories or error
   */
  async getAllCategories() {
    try {
      // Retrieving full category list
      const response = await api.get("/api/category/");
      return response;
    } catch (error) {
      console.log("CategoryService :: getAllCategories :: error ::", error);
      return error;
    }
  }

  /**
   * Fetches a category by its ID
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Category data or error
   */
  async getCategoryById(id) {
    try {
      // Fetching category details for the given ID
      const response = await api.get(`/api/category/${id}`);
      return response;
    } catch (error) {
      console.log("CategoryService :: getCategoryById :: error ::", error);
      return error;
    }
  }

  /**
   * Updates an existing category
   * @param {string} id - Category ID
   * @param {Object} param1
   * @param {string} param1.name - Updated category name
   * @returns {Promise<Object>} Updated category response or error
   */
  async updateCategoryById(id, { name }) {
    try {
      // Submitting updated name to backend
      const response = await api.put(`/api/category/${id}`, { name });
      return response;
    } catch (error) {
      console.log("CategoryService :: updateCategoryById :: error ::", error);
      return error;
    }
  }

  /**
   * Deletes a category based on ID
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Deletion result or error
   */
  async deleteCategoryById(id) {
    try {
      // Triggering deletion request for the specified category
      const response = await api.delete(`/api/category/${id}`);
      return response;
    } catch (error) {
      console.log("CategoryService :: deleteCategoryById :: error ::", error);
      return error;
    }
  }
}

// Export single instance
const categoryService = new CategoryService();
export default categoryService;
