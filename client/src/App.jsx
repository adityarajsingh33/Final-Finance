import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import AuthLayout from "./Layouts/AuthLayout";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicRoute from "./Guards/PublicRoute.jsx";

// PublicRoute wrapper

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}
