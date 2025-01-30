import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only check auth if there's a token
    const token = localStorage.getItem("token");
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/profile");
      console.log("Profile data:", data); // Debug log
      setUser(data);
    } catch (error) {
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      setUser(data.user);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password, mobileNumber) => {
    try {
      const { data } = await axios.post("/api/auth/register", {
        username,
        email,
        password,
        mobileNumber,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } finally {
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const updateUserData = async () => {
    await checkAuth();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
