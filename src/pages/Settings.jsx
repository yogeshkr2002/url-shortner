import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import "./Settings.css";

const Settings = () => {
  const { user, logout, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/auth/profile", formData);
      await updateUserData();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await axios.delete("/api/auth/profile");
      await logout();
      navigate("/login");
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error("Error deleting account");
      setDeleteDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="settings-container">
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-field">
            <label htmlFor="username">Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="mobileNumber">Mobile No.</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="save-button" disabled={loading}>
            Save Changes
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Account
          </button>
        </form>

        {deleteDialogOpen && (
          <div className="delete-dialog">
            <div className="dialog-overlay">
              <div className="dialog-content">
                <h3>Delete Account</h3>
                <p>
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
                <div className="dialog-actions">
                  <button onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </button>
                  <button
                    className="delete-account"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
