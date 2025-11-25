import { useEffect, useState } from "react";
import analyticsService from "../services/AnalyticsService";
import "./Analytics.css";
import { getMaxAmount } from "../utils/helpers";

export default function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [dateRangeData, setDateRangeData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-clear errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch Category Summary
  const fetchCategorySummary = async () => {
    try {
      const res = await analyticsService.getCategorySummary();
      if (res?.status === 200) {
        setCategoryData(res.data.data);
      } else {
        setError("Failed to fetch category summary.");
      }
    } catch (err) {
      setError("Server error occurred.");
    }
  };

  // Fetch Date-Range Analytics
  const fetchDateRangeAnalytics = async () => {
    if (!startDate || !endDate) {
      setError("Start and end date required.");
      return;
    }

    setLoading(true);
    try {
      const res = await analyticsService.getDateRangeAnalytics(startDate, endDate);
      if (res?.status === 200) {
        setDateRangeData(res.data.data);
      } else {
        setError("Failed to fetch date-range analytics.");
      }
    } catch (err) {
      setError("Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorySummary();
  }, []);

  return (
    <div className="analytics-container p-6 w-full h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics</h1>

      {error && <div className="analytics-error">{error}</div>}

      {/* CATEGORY SUMMARY */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Category Summary</h2>

        {categoryData.length === 0 ? (
          <p className="text-gray-600">No category summary available.</p>
        ) : (
          <div className="category-summary-grid">
            {categoryData.map((cat) => (
              <div key={cat.categoryId} className="analytics-card">
                <div className="analytics-card-title">{cat.categoryName}</div>
                <div className="analytics-card-row">
                  <span>Total Spend:</span>
                  <strong>₹{cat.totalAmount}</strong>
                </div>
                <div className="analytics-card-row">
                  <span>Transactions:</span>
                  <strong>{cat.expenseCount}</strong>
                </div>

                {/* Simple bar visualization */}
                <div className="analytics-bar-track">
                  <div
                    className="analytics-bar-fill"
                    style={{
                      width:
                        cat.totalAmount === 0
                          ? "5%"
                          : Math.min((cat.totalAmount / getMaxAmount(categoryData)) * 100, 100) +
                            "%",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DATE RANGE ANALYTICS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Date Range Analytics</h2>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <input
            type="date"
            className="analytics-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="analytics-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            onClick={fetchDateRangeAnalytics}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch"}
          </button>
        </div>

        {dateRangeData.length === 0 ? (
          <p className="text-gray-500">No data for selected date range.</p>
        ) : (
          <div className="date-range-table-wrapper">
            <table className="date-range-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Expenses Count</th>
                </tr>
              </thead>
              <tbody>
                {dateRangeData.map((item) => (
                  <tr key={item.date}>
                    <td>{item.date}</td>
                    <td>₹{item.totalAmount}</td>
                    <td>{item.expenseCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}