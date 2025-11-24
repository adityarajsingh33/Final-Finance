import { useEffect, useState } from "react";
import expenseService from "../services/ExpenseService";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../store/expenseSlice";
import ExpenseFormOverlay from "../components/ExpenseFormOverlay";
import "./Expense.css";

export default function Expense() {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expense.expenses);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("-1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null); // track which row dropdown is open

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (sortOrder) filters.sort = sortOrder;

      const response = await expenseService.getAllExpenses(filters);
      if (response?.status === 200) {
        dispatch(setExpenses(response.data.data));
      } else {
        setError(response?.response?.data?.message || "Failed to fetch expenses.");
      }
    } catch (err) {
      setError(err?.message || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [startDate, endDate, sortOrder]);

  const handleCreateExpense = () => {
    setEditingExpense(null);
    setShowOverlay(true);
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
    fetchExpenses(); // Refresh after creating/editing
  };

  const handleDropdownAction = (id, action) => {
    if (action === "edit") {
      const expense = expenses.find((e) => e._id === id);
      setEditingExpense(expense);
      setShowOverlay(true);
    }
    if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this expense?")) {
        expenseService.deleteExpense(id).then(() => fetchExpenses());
      }
    }
    setActiveDropdown(null); // close dropdown after action
  };

  return (
    <div className="expense-container p-6 w-full h-full">
      <div className="expense-header flex justify-between items-center mb-6">
        <h2 className="expense-title text-3xl font-bold">Expenses</h2>
        <button
          className="expense-create-btn bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
          onClick={handleCreateExpense}
        >
          + Create Expense
        </button>
      </div>

      {/* Filters */}
      <div className="expense-filters mb-6 flex gap-4 flex-wrap items-center">
        <input
          type="date"
          className="expense-filter-input border px-3 py-2 rounded shadow-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="expense-filter-input border px-3 py-2 rounded shadow-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <select
          className="expense-filter-input border px-3 py-2 rounded shadow-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="-1">Newest First</option>
          <option value="1">Oldest First</option>
        </select>
      </div>

      {error && <div className="expense-error mb-4 text-red-600 font-medium">{error}</div>}

      {loading ? (
        <div className="expense-loading text-gray-500 font-medium">Loading expenses...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="expense-table min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="expense-th p-3 text-left font-semibold">Amount</th>
                <th className="expense-th p-3 text-left font-semibold">Category</th>
                <th className="expense-th p-3 text-left font-semibold">Note</th>
                <th className="expense-th p-3 text-left font-semibold">Date</th>
                <th className="expense-th p-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp._id} className="expense-row border-b hover:bg-gray-50">
                    <td className="expense-td p-3">{exp.amount}</td>
                    <td className="expense-td p-3">{exp.categoryName || "N/A"}</td>
                    <td className="expense-td p-3">{exp.note || "-"}</td>
                    <td className="expense-td p-3">
                      {new Date(exp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="expense-td p-3">
                      <div className="flex gap-2 items-center">
                        <button
                          className="expense-action-btn px-3 py-1 border rounded hover:bg-gray-100 shadow-sm"
                          onClick={() =>
                            setActiveDropdown(activeDropdown === exp._id ? null : exp._id)
                          }
                        >
                          ⋮
                        </button>
                        {activeDropdown === exp._id && (
                          <div className="expense-dropdown flex flex-col gap-1 bg-white border shadow-md rounded px-2 py-1">
                            <button
                              className="expense-dropdown-btn text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleDropdownAction(exp._id, "edit")}
                            >
                              Edit
                            </button>
                            <button
                              className="expense-dropdown-btn text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                              onClick={() => handleDropdownAction(exp._id, "delete")}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showOverlay && (
        <ExpenseFormOverlay
          onClose={handleOverlayClose}
          editingExpense={editingExpense}
        />
      )}
    </div>
  );
}
