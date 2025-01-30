import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get("/api/analytics/dashboard");
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = ({ value, maxValue }) => (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: `${(value / maxValue) * 100}%` }}
      />
    </div>
  );

  if (loading) {
    return <div className="loading-bar"></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <span className="dashboard-title">Total Clicks</span>
        <span className="dashboard-value">{stats?.totalClicks || 0}</span>
      </div>

      <div className="Container">
        <div className="dashboard-card">
          <h3 className="dashboard-section-title">Date-wise Clicks</h3>
          <div className="dashboard-list">
            {stats?.clicksByDate?.map((item) => (
              <div key={item._id} className="dashboard-item">
                <span className="dashboard-item-label">
                  {new Date(item._id)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                    .replace(/\//g, "-")}
                </span>
                <ProgressBar
                  value={item.count}
                  maxValue={Math.max(...stats.clicksByDate.map((d) => d.count))}
                />
                <span className="dashboard-item-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-section-title">Click Devices</h3>
          <div className="dashboard-list">
            {stats?.clicksByDevice?.map((item) => (
              <div key={item._id} className="dashboard-item">
                <span className="dashboard-item-label">
                  {item._id === "Desktop" ? "Desktop" : item._id || "Unknown"}
                </span>
                <ProgressBar
                  value={item.count}
                  maxValue={Math.max(
                    ...stats.clicksByDevice.map((d) => d.count)
                  )}
                />
                <span className="dashboard-item-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
