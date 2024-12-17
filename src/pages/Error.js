import React from "react";
import styles from "../styles/Error.module.css";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Error = () => {
    
 const navigate=useNavigate();

  return (
    <Box className={styles.container}>
      <Typography className={styles.heading} align="center">
        Oops! 
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Something went wrong!! Try after some time .
      </Typography>

      <Typography variant="body1" color="text.secondary">
       
      </Typography>
      <Button sx={{mt:5}} onClick={(e)=>navigate('/users')} className={styles.btn}>Visit to Store</Button>
    </Box>
  );
};
