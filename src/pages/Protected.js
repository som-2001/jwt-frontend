import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../components/Navbar";
import styles from "../styles/Protected.module.css";


export const Protected = () => {
  const { isError, isLoading,isSuccess } = useQuery({
    queryKey: ["protected"],
    queryFn: () =>
      axios.get(`${process.env.REACT_APP_BASEURL}/authCheck`, {
        withCredentials: true,
      }),
  });

  if (isLoading)
    return (
      <Box className={styles.loader}>
        <CircularProgress size={30} />
      </Box>
    );
  if (isError) {
    localStorage.setItem("auth",false);
    return <Navigate to="/signin" />
  }
  if (isSuccess) localStorage.setItem("auth",true);

  return (
    <Box>
      <Navbar />
      <Outlet />
    </Box>
  );
};
