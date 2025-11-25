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
  const [activeDropdown, setActiveDropdown] = useState(null);

  // ✅ NEW: Search state
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-menu") && !event.target.closest(".action-btn")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCreateExpense = () => {
    setEditingExpense(null);
    setShowOverlay(true);
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
    setEditingExpense(null);
    fetchExpenses();
  };

  const handleDropdownAction = (id, action) => {
    if (action === "edit") {
      const selected = expenses.find((e) => e._id === id);
      setEditingExpense(selected);
      setShowOverlay(true);
    }

    if (action === "delete") {
      if (confirm("Delete this expense?")) {
        expenseService.deleteExpenseById(id).then(fetchExpenses);
      }
    }

    setActiveDropdown(null);
  };

  // ✅ NEW: Filter logic
  const filteredExpenses = expenses.filter((exp) => {
    const q = searchQuery.toLowerCase();

    return (
      exp.amount.toString().includes(q) ||
      (exp.categoryName || "").toLowerCase().includes(q) ||
      (exp.note || "").toLowerCase().includes(q) ||
      new Date(exp.createdAt).toLocaleDateString().includes(q)
    );
  });

  return (
    <div className="expense-container p-6 w-full h-full">

      <div className="expense-header flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Expenses</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
          onClick={handleCreateExpense}
        >
          + Create Expense
        </button>
      </div>

      {/* Filters */}
      <div className="expense-filters mb-6 flex gap-4 flex-wrap items-center">

        {/* DATE FILTERS */}
        <input type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="expense-filter-input"
        />

        <input type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="expense-filter-input"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="expense-filter-input"
        >
          <option value="-1">Newest First</option>
          <option value="1">Oldest First</option>
        </select>

        {/* ✅ NEW SEARCH BOX */}
        <input
          type="text"
          placeholder="Search..."
          className="expense-filter-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ minWidth: "180px" }}
        />

      </div>

      {error && <div className="expense-error">{error}</div>}

      {loading ? (
        <div className="expense-loading">Loading expenses...</div>
      ) : (
        <div className="table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Note</th>
                <th>Date</th>
                <th style={{ width: "70px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No matching expenses
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>{exp.amount}</td>
                    <td>{exp.categoryName}</td>
                    <td>{exp.note || "-"}</td>
                    <td>{new Date(exp.createdAt).toLocaleDateString()}</td>

                    <td className="actions-cell">
                      <div className="action-wrapper">
                        <button
                          className="action-btn"
                          onClick={() =>
                            setActiveDropdown(activeDropdown === exp._id ? null : exp._id)
                          }
                        >
                          ⋮
                        </button>

                        {activeDropdown === exp._id && (
                          <div className="dropdown-menu">
                            <button onClick={() => handleDropdownAction(exp._id, "edit")}>
                              Edit
                            </button>
                            <button
                              className="text-red-500"
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
          expenseData={editingExpense}
          isOpen={showOverlay}
        />
      )}
    </div>
  );
}
