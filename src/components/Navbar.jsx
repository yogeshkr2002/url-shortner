import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import CreateLinkModal from "./CreateLinkModal";
import { toast } from "react-toastify";

const Navbar = ({ onLinkCreated, onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Format current date
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    );
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    setLogoutDialogOpen(false);
    navigate("/login");
  };

  const handleCreateLink = async (newLink) => {
    setCreateModalOpen(false);
    if (onLinkCreated) {
      onLinkCreated(newLink);
    }
    if (location.pathname !== "/links") {
      navigate("/links");
    }
    toast.success("Link created successfully");
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "calc(100% - 240px)",
        ml: "240px",
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#333",
              }}
            >
              {`☀️ ${greeting}, ${user?.username}`}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "#666",
              fontSize: "14px",
            }}
          >
            {currentDate}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              backgroundColor: "#2962ff",
              "&:hover": {
                backgroundColor: "#1e4bd8",
              },
              textTransform: "none",
              fontSize: "16px",
              px: 3,
              borderRadius: "8px",
            }}
          >
            Create new
          </Button>

          <TextField
            placeholder="Search by remarks"
            size="small"
            onChange={handleSearch}
            sx={{
              width: "250px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />

          <Avatar
            onClick={handleMenu}
            sx={{
              bgcolor: "#ffd700",
              color: "#333",
              width: 35,
              height: 35,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleLogoutConfirm}
            color="primary"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <CreateLinkModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onLinkCreated={handleCreateLink}
      />
    </AppBar>
  );
};

export default Navbar;
