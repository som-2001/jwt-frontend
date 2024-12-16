import React from "react";
import styles from "../styles/Success.module.css";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Success = () => {
    const navigate=useNavigate();

  return (
    <Box className={styles.container}>
      <Typography className={styles.heading} align="center">
        Congratulations! 🎉
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Your Payment was successful.
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Thank you for being part of our customer.
      </Typography>
      <Button sx={{mt:5}} onClick={(e)=>navigate('/users')} className={styles.btn}>Visit to Store</Button>
    </Box>
  );
};
