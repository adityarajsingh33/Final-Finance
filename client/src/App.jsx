import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import AuthLayout from "./Layouts/AuthLayout";
import HomeLayout from "./layouts/HomeLayout";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Route Guards
import PublicRoute from "./Guards/PublicRoute.jsx";
import ProtectedRoute from "./Guards/ProtectedRoute.jsx";
import Expense from "./pages/Expense.jsx";
import Category from "./pages/Category.jsx";
import Analytics from "./pages/Analytics.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (Login / Signup) */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Expense />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
