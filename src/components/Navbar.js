import React from "react";
import { AppBar, Toolbar, Typography,Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import "../App.css"

export const Navbar = () => {
  return (
    <AppBar position="static" color="whitesmoke">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>
        <Box>
          <NavLink to="/signin" className={({ isActive }) => isActive ? "active" : "link"}>
            Sign In
          </NavLink>
          <NavLink to="/" className={({isActive})=>isActive ?"active" : "link"}>Sign Up</NavLink>
          <NavLink className="link">Logout</NavLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
