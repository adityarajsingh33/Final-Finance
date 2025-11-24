import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export class CategoryService {
  // Create a new category
  async createCategory({ name }) {
    try {
      const response = await api.post("/api/category/", { name });
      return response;
    } catch (error) {
      console.log("CategoryService :: createCategory :: error ::", error);
      return error;
    }
  }

  // Get all categories
  async getAllCategories() {
    try {
      const response = await api.get("/api/category/");
      return response;
    } catch (error) {
      console.log("CategoryService :: getAllCategories :: error ::", error);
      return error;
    }
  }

  // Get a single category by id
  async getCategoryById(id) {
    try {
      const response = await api.get(`/api/category/${id}`);
      return response;
    } catch (error) {
      console.log("CategoryService :: getCategoryById :: error ::", error);
      return error;
    }
  }

  // Update a category by id
  async updateCategoryById(id, { name }) {
    try {
      const response = await api.patch(`/api/category/${id}`, { name });
      return response;
    } catch (error) {
      console.log("CategoryService :: updateCategoryById :: error ::", error);
      return error;
    }
  }

  // Delete a category by id
  async deleteCategoryById(id) {
    try {
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
