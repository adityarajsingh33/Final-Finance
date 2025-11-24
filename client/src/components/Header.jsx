import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";
import "./Header.css";
import authService from "../services/AuthService";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout =async () => {
    try {
        const response = await authService.logoutUser();
  
        if (response?.status === 200) {
            dispatch(clearUser());
            navigate("/login");
        } else {
          console.error(response?.response?.data?.message || "Logout failed.");
        }
      } catch (err) {
        console.error(err?.message || "Server error occurred.");
      }
  };

  // Utility function for active link styling
  const navLinkClass = ({ isActive }) =>
    `header-nav-link text-gray-700 hover:text-gray-900 ${
      isActive ? "header-nav-link-active" : ""
    }`;

  return (
    <header className="header-container flex items-center justify-between px-6 bg-white shadow-md h-[50px]">
      {/* Left: Brand */}
      <div className="header-brand text-2xl font-bold text-gradient">
        Final Finance
      </div>

      {/* Center: Navigation */}
      <nav className="header-nav flex space-x-6">
        <NavLink to="/" className={navLinkClass}>
          Expenses
        </NavLink>
        <NavLink to="/category" className={navLinkClass}>
          Categories
        </NavLink>
        <NavLink to="/analytics" className={navLinkClass}>
          Analytics
        </NavLink>
      </nav>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="header-logout-btn bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
}
