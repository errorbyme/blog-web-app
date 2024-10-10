import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useMyContext } from "../ContextAPI/ContextApi";
import { TextField } from "@mui/material";
import { FaSearch } from "react-icons/fa";

export default function SearchPage() {
  const { isSearchBox, handleClose, searchValue, SetsearchValue } =
    useMyContext();
  return (
    <Modal open={isSearchBox} onClose={handleClose} className="search-page">
      <Box className="search-container">
        <div className="search-header">
          <TextField
            sx={{ width: "100%" }}
            type="search"
            autoFocus
            onChange={(e) => SetsearchValue(e.target.value)}
            value={searchValue}
            placeholder="Search Category or Topic wise..."
          />
          <FaSearch className="search-icon" />
        </div>
      </Box>
    </Modal>
  );
}
