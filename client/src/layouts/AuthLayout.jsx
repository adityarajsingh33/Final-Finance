import { Link, Outlet, useLocation } from "react-router-dom";
import "./AuthLayout.css";

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isSignup = pathname === "/signup";

  return (
    <div className="flex h-screen w-full auth-layout-container">
      
      <div className="flex flex-col justify-center items-center auth-layout-left-panel">

        <div className="auth-layout-left-content flex flex-col items-center">

          <h2 className="auth-layout-title text-4xl">Welcome</h2>
          <h2 className="auth-layout-title text-2xl">To</h2>
          <h2 className="auth-layout-title mb-10 text-4xl">Final Finance</h2>

          <p className="auth-layout-subtext text-center text-1xl mb-5">
            Your Final Finance Tracker
          </p>

          <p className="auth-layout-subtext text-center text-1xl mb-5">
            To keep connected with us please login with your personal info
          </p>

          {isSignup ? (
            <Link
              to="/login"
              className="auth-layout-signin-btn flex items-center justify-center"
            >
              SIGN IN
            </Link>
          ) : (
            <Link
              to="/signup"
              className="auth-layout-signin-btn flex items-center justify-center"
            >
              SIGN UP
            </Link>
          )}

        </div>

      </div>

      <div className="flex justify-center items-center auth-layout-right-panel">
        <div className="auth-layout-outlet-wrapper w-full">
          <Outlet />
        </div>
      </div>

    </div>
  );
}
