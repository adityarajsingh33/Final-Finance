import axios from "axios";

// Load the base API URL from environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Create a preconfigured Axios instance for authenticated requests
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export class AnalyticsService {
  /**
   * Retrieves the category-wise analytics summary
   * @returns {Promise<Object>} The API response or the error object
   */
  async getCategorySummary() {
    try {
      // Hitting the category summary analytics endpoint
      const response = await api.get("/api/analytics/category-summary");
      return response;
    } catch (error) {
      console.log("AnalyticsService :: getCategorySummary :: error ::", error);
      return error;
    }
  }

  /**
   * Retrieves analytics for a specific date range
   * @param {string} startDate - Starting date of the range (YYYY-MM-DD)
   * @param {string} endDate - Ending date of the range (YYYY-MM-DD)
   * @returns {Promise<Object>} The API response or the error object
   */
  async getDateRangeAnalytics(startDate, endDate) {
    try {
      // Constructing the query string dynamically for the date range
      const response = await api.get(
        `/api/analytics/date-range?startDate=${startDate}&endDate=${endDate}`
      );
      return response;
    } catch (error) {
      console.log("AnalyticsService :: getDateRangeAnalytics :: error ::", error);
      return error;
    }
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
