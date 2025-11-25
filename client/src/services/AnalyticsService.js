import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export class AnalyticsService {
  async getCategorySummary() {
    try {
      const response = await api.get("/api/analytics/category-summary");
      return response;
    } catch (error) {
      console.log("AnalyticsService :: getCategorySummary :: error ::", error);
      return error;
    }
  }

  async getDateRangeAnalytics(startDate, endDate) {
    try {
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
