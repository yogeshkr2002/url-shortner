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
  IconButton,
  Tooltip,
  Chip,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "../utils/axios";
import CreateLinkModal from "../components/CreateLinkModal";
import EditLinkModal from "../components/EditLinkModal";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import "./Links.css";
import BASE_URL from "../utils/config";
const Links = () => {
  const [links, setLinks] = useState([]);
  const [editLink, setEditLink] = useState(null);
  const [deleteLink, setDeleteLink] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { searchTerm } = useOutletContext();
  const [filteredLinks, setFilteredLinks] = useState([]);

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = links.filter((link) =>
        link.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLinks(filtered);
    } else {
      setFilteredLinks(links);
    }
  }, [searchTerm, links]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/links");
      setLinks(data);
    } catch (error) {
      toast.error("Error fetching links");
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleEdit = (link) => {
    setEditLink(link);
    setEditModalOpen(true);
  };

  const handleDelete = (link) => {
    setDeleteLink(link);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async (updatedLink) => {
    try {
      const { data } = await axios.put(`/api/links/${updatedLink._id}`, {
        originalUrl: updatedLink.originalUrl,
        remarks: updatedLink.remarks,
        expirationDate: updatedLink.expirationDate,
      });

      setLinks((prevLinks) =>
        prevLinks.map((link) => (link._id === updatedLink._id ? data : link))
      );

      setEditModalOpen(false);
      toast.success("Link updated successfully");
    } catch (error) {
      toast.error("Error updating link");
      console.error("Error updating link:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/links/${deleteLink._id}`);
      setDeleteDialogOpen(false);
      fetchLinks();
      toast.success("Link deleted successfully");
    } catch (error) {
      toast.error("Error deleting link");
      console.error("Error deleting link:", error);
    }
  };

  const getStatus = (expirationDate) => {
    if (!expirationDate) return "Active";
    return new Date() < new Date(expirationDate) ? "Active" : "Inactive";
  };

  const handleCreateLink = (newLink) => {
    setLinks((prevLinks) => [newLink, ...prevLinks]);
    setCreateModalOpen(false);
  };

  return (
    <div className="container">
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell className="table-cell">Date</TableCell>
                <TableCell className="table-cell">Original Link</TableCell>
                <TableCell className="table-cell">Short Link</TableCell>
                <TableCell className="table-cell">Remarks</TableCell>
                <TableCell className="table-cell">Clicks</TableCell>
                <TableCell className="table-cell">Status</TableCell>
                <TableCell className="table-cell">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredLinks.length > 0 ? filteredLinks : links).map(
                (link) => (
                  <TableRow key={link._id} className="table-row">
                    <TableCell className="table-cell-content">
                      {formatDate(link.createdAt)}
                    </TableCell>
                    <TableCell className="table-cell-content ellipsis">
                      {link.originalUrl}
                    </TableCell>
                    <TableCell className="table-cell-content1">
                      <Box className="short-link-container">
                        {`${BASE_URL}/${link.shortHash}`}
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopy(`${BASE_URL}/${link.shortHash}`)
                          }
                          className="icon-button"
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell className="table-cell-content">
                      {link.remarks ? `: ${link.remarks}` : ""}
                    </TableCell>
                    <TableCell className="table-cell-content">
                      {link.clicks}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatus(link.expirationDate)}
                        color={
                          getStatus(link.expirationDate) === "Active"
                            ? "success"
                            : "error"
                        }
                        size="small"
                        className={`status-chip ${
                          getStatus(link.expirationDate) === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      />
                    </TableCell>
                    <TableCell>
                      <Box className="icon-button-container">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(link)}
                          className="icon-button"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(link)}
                          className="icon-button"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              )}
              {filteredLinks.length === 0 && searchTerm && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No links found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <EditLinkModal
        open={editModalOpen}
        link={editLink}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <CreateLinkModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onLinkCreated={handleCreateLink}
      />
    </div>
  );
};

export default Links;
