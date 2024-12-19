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
  IconButton,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import { useMutation } from "@tanstack/react-query";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import {useSelector} from 'react-redux';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from '@mui/icons-material/Inventory';

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {cart_length}=useSelector((state)=>state.cart);

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

        // Clear Stripe-related cookies
        document.cookie.split(";").forEach((cookie) => {
          const [key] = cookie.split("=");
          if (key.trim().startsWith("__stripe")) {
            document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
          }
        });
      
        // Clear Stripe-related localStorage
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("stripe") || key.startsWith("__stripe")) {
            localStorage.removeItem(key);
          }
        });
      
        // Clear Stripe-related sessionStorage
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith("stripe") || key.startsWith("__stripe")) {
            sessionStorage.removeItem(key);
          }
        });
      
        console.log("Stripe Link email and session data cleared.");
      
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
            MyStore
          </Typography>
          <NavLink className="link" to="/users" title="products" > 
             
             <IconButton aria-label="cart">
                <StyledBadge badgeContent={20} color="secondary">
                <InventoryIcon sx={{color:"rgb(0 0 0 / 54%)"}}/>
                </StyledBadge>
              </IconButton>
          </NavLink>

          <NavLink className="link" to="/cart">
           
              <IconButton aria-label="cart">
                <StyledBadge badgeContent={cart_length} color="secondary">
                  <ShoppingCartIcon />
                </StyledBadge>
              </IconButton>
            
          </NavLink>

          <Box sx={{ display: "flex" }}>
            <NavLink className="link" onClick={handleLogout}>
              <Box className="gap1">
                <LogoutIcon />
                <Typography variant="body1" color="text.secondary">
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
