import React, {useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import styles from "../styles/Users.module.css";
import { SearchSharp } from "@mui/icons-material";
import {createTheme,ThemeProvider} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import { searchProduct} from '../redux/slice/cartSlice.js';
import { ProductList } from "../components/ProductList.js";
import { ToastContainer } from "react-toastify";

export const Users = React.memo(() => {
 
  const {search}=useSelector(state=>state.cart);
  const inputRef=useRef(null);
  const focusRef=useRef(null);
 
  const dispatch=useDispatch();

  const theme = createTheme({
    breakpoints: {
      values: {
        xss: 0,
        xs:350,    
        sm: 826,  
        md: 1196,  
        lg: 1536, 
        custom: 1800 
      },
    },
  });

  const handleSearch = (e) => {
    inputRef.current=e.target.value;
    dispatch(searchProduct(e.target.value));
  };


  return (
    <ThemeProvider theme={theme}>
       <ToastContainer/>
    <Box className={styles.parent}>
      <Box className={styles.search}>
        <Typography
          variant="h4"
          gutterBottom
          color="text.secondary"
          sx={{ my: 4, fontSize: { xss: "1.2rem", sm: "1.9rem" } }}
        >
          Product List
        </Typography>
        <TextField
          type="text"
          placeholder="Search something..."
          inputRef={focusRef}
          value={search}
          sx={{ width: { xs: "200px", sm: "400px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchSharp sx={{cursor:"pointer"}} />
              </InputAdornment>
            ),
          }}
          onChange={handleSearch}
        />
      </Box>

      <ProductList focusRef={focusRef}/>
      
    </Box>
    </ThemeProvider>
  );
});
