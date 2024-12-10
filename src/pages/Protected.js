import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const Protected = () => {
  
    const { isError, isLoading } = useQuery({
      queryKey: ["protected"],
      queryFn: () => axios.get(`${process.env.REACT_APP_BASEURL}/authCheck`, { withCredentials: true }),
    });
    
    if (isLoading) return <Box><CircularProgress size={30}/></Box>;
    if (isError) return <Navigate to='/signin'/>

  return (
    <Box>
      <Outlet />
    </Box>
  );
};
