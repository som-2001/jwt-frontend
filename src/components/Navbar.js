import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import { useMutation } from "@tanstack/react-query";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const mutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => {
      return axios.post(
        `${process.env.REACT_APP_BASEURL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      localStorage.setItem("auth", false);
      navigate("/signin");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const Logout = () => {
    mutation.mutate();
  };

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar className="boxShadow">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Box sx={{display:'flex'}}>
            <NavLink className="link" onClick={handleLogout}>
              <Box className="gap1">
                <LogoutIcon />
                <Typography variant="h6" color="text.secondary">
                  Logout
                </Typography>
              </Box>
            </NavLink>
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button color="primary" onClick={Logout}>
            {mutation.isPending ? (
              <CircularProgress size={30} />
            ) : (
              <span>Yes</span>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
