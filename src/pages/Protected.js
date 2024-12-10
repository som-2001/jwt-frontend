import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../components/Navbar";

export const Protected = () => {
  
    const { isError, isLoading } = useQuery({
      queryKey: ["protected"],
      queryFn: () => axios.get(`${process.env.REACT_APP_BASEURL}/authCheck`, { withCredentials: true }),
    });
    
    if (isLoading) return <Box><CircularProgress size={30}/></Box>;
    if (isError) return <Navigate to='/signin'/>

  return (
    <Box>
      <Navbar/>
      <Outlet />
    </Box>
  );
};
