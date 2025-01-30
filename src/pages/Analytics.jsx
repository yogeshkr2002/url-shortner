import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import "./Analytics.css";

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/analytics/all");
      setAnalytics(data);
    } catch (error) {
      toast.error("Error fetching analytics");
      setAnalytics([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })} ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };

  return (
    <div className="analytics-container">
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell className="table-cell">Timestamp</TableCell>
                <TableCell className="table-cell">Original Link</TableCell>
                <TableCell className="table-cell">Short Link</TableCell>
                <TableCell className="table-cell">IP Address</TableCell>
                <TableCell className="table-cell">User Device</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.map((record) => (
                <TableRow key={record._id} className="table-row">
                  <TableCell className="table-cell-content">
                    {formatDateTime(record.timestamp)}
                  </TableCell>
                  <TableCell
                    className="table-cell-content"
                    title={record.link?.originalUrl}
                  >
                    {record.link?.originalUrl}
                  </TableCell>
                  <TableCell className="table-cell-content">
                    {record.link?.shortHash}
                  </TableCell>
                  <TableCell className="table-cell-content">
                    {record.ipAddress}
                  </TableCell>
                  <TableCell className="table-cell-content">
                    {record.userDevice}
                  </TableCell>
                </TableRow>
              ))}
              {analytics.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="empty-data">
                    <Typography variant="body1" color="text.secondary">
                      No analytics data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Analytics;
