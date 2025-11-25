import { useEffect, useState } from "react";
import categoryService from "../services/CategoryService";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../store/categorySlice";
import "./Category.css";

export default function Category() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await categoryService.getAllCategories();
      if (response?.status === 200) {
        dispatch(setCategories(response.data.data));
      } else {
        setError("Failed to load categories.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-menu") && !e.target.closest(".action-btn")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Auto-hide error & success messages
  useEffect(() => {
    if (error || successMsg) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMsg]);

  const handleCreate = () => {
    setEditingCategory(null);
    setCategoryName("");
    setShowForm(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      const response = await categoryService.deleteCategoryById(id);
      if (response?.status === 200 || response?.data?.success) {
        setSuccessMsg("Category deleted successfully.");
        fetchCategories();
      } else {
        throw new Error(response?.data?.message);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Cannot delete category because it is used by existing expenses."
      );
    }
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) return setError("Name cannot be empty");

    try {
      let response;
      if (editingCategory) {
        response = await categoryService.updateCategoryById(editingCategory._id, {
          name: categoryName,
        });
      } else {
        response = await categoryService.createCategory({ name: categoryName });
      }

      if (response?.status === 200 || response?.data?.success) {
        setShowForm(false);
        setCategoryName("");
        setEditingCategory(null);
        fetchCategories();
      } else {
        setError("Operation failed.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Server error.");
    }
  };

  // Filter categories via search
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="category-container p-6 w-full h-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Categories</h2>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
          onClick={handleCreate}
        >
          + Create Category
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="expense-filter-input"
          style={{ minWidth: "200px" }}
        />
      </div>

      {error && <div className="category-error">{error}</div>}
      {successMsg && <div className="category-success">{successMsg}</div>}

      {loading ? (
        <div className="expense-loading">Loading categories...</div>
      ) : (
        <div className="category-card-grid">
          {filteredCategories.length === 0 ? (
            <p className="text-gray-500">No categories found</p>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat._id} className="category-card">
                <span className="category-card-name">{cat.name}</span>

                <div className="relative">

                  <button
                    className="action-btn"
                    onClick={() =>
                      setActiveDropdown(activeDropdown === cat._id ? null : cat._id)
                    }
                  >
                    ⋮
                  </button>

                  {activeDropdown === cat._id && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleEdit(cat)}>Edit</button>
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(cat._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Inline Form */}
      {showForm && (
        <div className="category-form-overlay">
          <div className="category-form-box">
            <h3 className="text-xl font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h3>

            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="category-input"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
              >
                Cancel
              </button>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                {editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
