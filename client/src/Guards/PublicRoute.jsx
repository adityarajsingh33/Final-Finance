import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * PublicRoute ensures that the route is only accessible
 * if the user is NOT authenticated.
 * If authenticated, it redirects to the homepage (`/`).
 */
export default function PublicRoute({ children }) {
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = !!user;

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}
