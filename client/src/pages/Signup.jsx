import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "../services/AuthService";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setApiError("");
    setLoading(true);

    try {
      const response = await authService.registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response?.status === 201) {
        navigate("/login");
      } else {
        setApiError(response?.response?.data?.message || "Signup failed.");
      }
    } catch (err) {
      setApiError(err?.message || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full signup-signup-container">
      <h2 className="text-3xl font-semibold mb-4 signup-signup-title">
        Create Account
      </h2>

      <p className="text-sm mb-6 signup-signup-subtext">
        Sign up to start managing your expenses seamlessly
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        {/* API error */}
        {apiError && (
          <div className="signup-error-box mb-4 text-center">{apiError}</div>
        )}

        {/* Name input */}
        <input
          type="text"
          placeholder="Full Name"
          className={`signup-input mb-4 px-4 py-2 border rounded ${
            errors.name ? "border-red-500" : ""
          }`}
          {...register("name", {
            required: "Full name is required.",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters.",
            },
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
        )}

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className={`signup-input mb-4 px-4 py-2 border rounded ${
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

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className={`signup-input mb-4 px-4 py-2 border rounded ${
            errors.password ? "border-red-500" : ""
          }`}
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters.",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        {/* Confirm Password input */}
        <input
          type="password"
          placeholder="Confirm Password"
          className={`signup-input mb-6 px-4 py-2 border rounded ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
          {...register("confirmPassword", {
            required: "Confirm password is required.",
            validate: (value) =>
              value === password || "Passwords do not match.",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="signup-signup-btn w-full py-2 rounded text-white"
          disabled={loading}
        >
          {loading ? "Signing up..." : "SIGN UP"}
        </button>
      </form>

      <p className="text-sm mt-6 signup-signup-bottom-text">
        Already have an account?
        <span className="signup-login-link ml-1">
          <a href="/login">Sign in</a>
        </span>
      </p>
    </div>
  );
}
