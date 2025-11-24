import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import authService from "../services/AuthService";
import { setUser } from "../store/userSlice";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setApiError("");
    setLoading(true);

    try {
      const response = await authService.loginUser({
        email: data.email,
        password: data.password,
      });

      if (response?.status === 200) {
        // store user in Redux
        dispatch(setUser(response.data.data.user));
        navigate("/dashboard");
      } else {
        setApiError(response?.data?.message || "Login failed.");
      }
    } catch (err) {
      setApiError(err?.message || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full login-login-container">
      <h2 className="text-3xl font-semibold mb-4 login-login-title">Sign In</h2>
      <p className="text-sm mb-6 login-login-subtext">
        Use your account credentials to access your dashboard
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        {apiError && (
          <div className="login-error-box mb-4 text-center">{apiError}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className={`login-input mb-4 px-4 py-2 border rounded ${
            errors.email ? "border-red-500" : ""
          }`}
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[\w.-]+@[\w.-]+\.\w+$/,
              message: "Invalid email address.",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className={`login-input mb-6 px-4 py-2 border rounded ${
            errors.password ? "border-red-500" : ""
          }`}
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 4,
              message: "Password must be at least 4 characters.",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="login-login-btn w-full py-2 rounded text-white"
          disabled={loading}
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>
      </form>

      <p className="text-sm mt-6 login-login-bottom-text">
        Don’t have an account?
        <span className="login-signup-link ml-1">
          <a href="/signup">Create one</a>
        </span>
      </p>
    </div>
  );
}
