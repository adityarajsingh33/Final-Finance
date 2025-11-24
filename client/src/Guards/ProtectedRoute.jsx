import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import authService from "../services/AuthService";
import { setUser, clearUser } from "../store/userSlice";

/**
 * ProtectedRoute ensures that only authenticated users can access the route.
 * If user is not in Redux, it fetches the current user from API.
 * If fetching fails, redirects to /login.
 */
export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [checking, setChecking] = useState(true); // while fetching user

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        try {
          const response = await authService.getCurrentUser();
          if (response?.status === 200) {
            dispatch(setUser(response.data.data)); // store in Redux
          } else {
            dispatch(clearUser());
          }
        } catch (err) {
          dispatch(clearUser());
        } finally {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    };

    fetchUser();
  }, [user, dispatch]);

  if (checking) {
    // Show loading while verifying user
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User authenticated
  return children;
}
