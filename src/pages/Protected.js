import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../components/Navbar";
import styles from "../styles/Protected.module.css";
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { initializeCartLength } from "../redux/slice/cartSlice";

export const Protected = () => {

  
  const dispatch=useDispatch();

  const { isError, isLoading,isSuccess } = useQuery({
    queryKey: ["protected"],
    queryFn: () =>
      axios.get(`${process.env.REACT_APP_BASEURL}/authCheck`, {
        withCredentials: true,
      }),
  });

  const { data, isSuccess:success } = useQuery({
    queryKey: ["fetch_cart_product"],
    queryFn: () => {
      return axios.get(`${process.env.REACT_APP_BASEURL}/getUserCart`, {
        withCredentials: true,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  
  useEffect(() => {
    if (success) {
      
      dispatch(initializeCartLength(data.data.cart_items));
    }
  }, [dispatch,success, data]);

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
