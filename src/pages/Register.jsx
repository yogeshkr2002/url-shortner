import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.mobileNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.mobileNumber
      );
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left"></div>
      <div className="register-right">
        <div className="register-box">
          <h2>Join us Today!</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email id"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile no."
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              maxLength="10"
              pattern="[0-9]*"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
