import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [links, setLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLinkCreated = (newLink) => {
    setLinks((prevLinks) => [newLink, ...prevLinks]);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "calc(100vw - 240px)",
          overflow: "hidden",
        }}
      >
        <Navbar onLinkCreated={handleLinkCreated} onSearch={handleSearch} />
        <Box sx={{ mt: 8, p: 3 }}>
          <Outlet context={{ links, setLinks, searchTerm }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
