import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import expenseService from "../services/ExpenseService";
import categoryService from "../services/CategoryService";
import { addExpense, setExpenses } from "../store/expenseSlice";
import "./ExpenseFormOverlay.css";

export default function ExpenseFormOverlay({ isOpen, onClose, expenseData }) {
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // If editing, populate fields
  useEffect(() => {
    if (expenseData) {
      setAmount(expenseData.amount);
      setNote(expenseData.note || "");
      setCategoryId(expenseData.category || "");
    } else {
      setAmount("");
      setNote("");
      setCategoryId("");
    }
  }, [expenseData]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      if (res?.status === 200) setCategories(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      setLoading(false);
      return;
    }

    if (!categoryId) {
      setError("Please select a category");
      setLoading(false);
      return;
    }

    try {
      let response;

      if (expenseData) {
        // Update existing expense
        response = await expenseService.updateExpenseById(expenseData._id, {
          amount,
          categoryId,
          note,
        });
        if (response?.status === 200) {
          dispatch(setExpenses(response.data.data));
        }
      } else {
        // Create new expense
        response = await expenseService.createExpense({
          amount,
          categoryId,
          note,
        });
        if (response?.status === 201) {
          dispatch(addExpense(response.data.data));
        }
      }

      onClose(); // Close overlay on success
    } catch (err) {
      setError(err?.message || "Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="expense-overlay">
      <div className="expense-form-container">
        <h2 className="expense-form-title">
          {expenseData ? "Edit Expense" : "Create Expense"}
        </h2>

        {error && <div className="expense-form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="expense-form">
          <label className="expense-form-label">Amount</label>
          <input
            type="number"
            className="expense-form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label className="expense-form-label">Category</label>
          <select
            className="expense-form-input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label className="expense-form-label">Note</label>
          <input
            type="text"
            className="expense-form-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="expense-form-actions mt-4 flex justify-end space-x-2">
            <button
              type="button"
              className="expense-form-cancel-btn px-4 py-2 rounded border"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="expense-form-submit-btn px-4 py-2 rounded bg-blue-500 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : expenseData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
