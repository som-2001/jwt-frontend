import {
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import styles from "../styles/ViewProduct.module.css";
import { useParams } from "react-router-dom";
import {useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { RenderCards } from "../components/RenderCards.js";
import { ProductDetailsCard } from "../components/ProductDetailsCard.js";
import { ToastContainer } from "react-toastify";

export const ViewProduct = () => {
  const { id, category } = useParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: result1, isError: error1,isLoading } = useQuery({
    queryKey: ["DetailsByCategory", category,id],
    queryFn: () => {
      return axios.get(
        `${process.env.REACT_APP_BASEURL}/products/category?category=${category}&id=${id}`
        ,{
          withCredentials:true
        }
      );
    },
    select: (data) => data.data,
  });

  const { data, refetch } = useQuery({
    queryKey: ["cart_id"],
    queryFn: () => {
      return axios.get(`${process.env.REACT_APP_BASEURL}/getCartId`, {
        withCredentials: true,
      });
    },
    select: (data) => data.data,
  });

  if (error1) return <h1>Error...</h1>;

  return (
    <Box>
      <ToastContainer/>
      <ProductDetailsCard id={id} refetch={refetch} data={data} />
      <Box>
        <Typography variant="h6" align="center" sx={{ padding: "20px" }}>
          Similar products you may interested in
        </Typography>

        {isLoading?<Box className={styles.loader}><CircularProgress/></Box>:<Box>
          <Grid container spacing={2} sx={{ my: 2 }}>
            {result1?.map((item, index) => (
              <Grid
                item
                xs={12}
                lg={3}
                key={index}
                className={styles.parentGrid}
              >
                <RenderCards product={item} data1={data} refetch={refetch} />
              </Grid>
            ))}
          </Grid>
        </Box>
        }
      </Box>
    </Box>
  );
};
