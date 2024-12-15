import {
  Box,
  Button,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import styles from "../styles/ViewProduct.module.css";
import StarIcon from "@mui/icons-material/Star";
import SellIcon from "@mui/icons-material/Sell";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { addToCart1 } from "../redux/slice/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const ProductDetailsCard = ({ id, refetch, data }) => {
  const dispatch = useDispatch();

  const { data: result, isLoading: load, isError } = useQuery({
    queryKey: ["productById", id],
    queryFn: () => {
      return axios.get(`https://fakestoreapi.com/products/${id}`);
    },
    select: (data) => data.data,
  });

  const mutation = useMutation({
    mutationKey: ["add_to_cart"],
    mutationFn: (data) => {
      return axios.post(`${process.env.REACT_APP_BASEURL}/addtocart`, data, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Product has been added sucessfully.");
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const addToCart = async (data) => {
    if (data === undefined) return;

    const payload = {
      id: id,
      count: 1,
      title: data?.title,
      image: data?.image,
      category: data?.category,
      actualPrice: data?.price,
      price: data?.price,
      description: data?.description,
    };
    mutation.mutate(payload);
    dispatch(addToCart1());
  };
  if (isError) return <Navigate to="/signin" />;

  return (
    <Grid container spacing={2} sx={{ padding: { xs: "0px", md: "67px" } }}>
      <Grid item xs={12} lg={5} className={styles.childGrid1}>
        {load ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={300}
            height={500}
          />
        ) : (
          <CardMedia
            component="img"
            src={result.image}
            sx={{ width: { xs: "300px", md: "400px" }, objectFit: "contain" }}
            className={styles.image}
          />
        )}
      </Grid>
      <Grid item xs={12} lg={7} className={styles.childGrid2}>
        <Box sx={{ width: { xs: "300px", sm: "500px", lg: "700px" } }}>
          <Typography variant="h6" color="text.secondary">
            {load ? <Skeleton animation="wave" /> : result.title}
          </Typography>
          <Box className={styles.childGrid3}>
            <Stack direction="row">
              <Chip icon={<StarIcon />} label={result?.rating?.rate} />
            </Stack>
            <Typography variant="body2">
              {result?.rating?.count
                ? `${9.5 * result.rating.count} Ratings & ${
                    result.rating.count
                  } Reviews`
                : "No Ratings & Reviews"}
            </Typography>
          </Box>
          <Typography variant="body2" color="red" sx={{ my: 1 }}>
            Hurry, only a few product left!
          </Typography>
          <Typography variant="body2">
            <Box className={styles.childGrid3}>
              <SellIcon sx={{ color: "green" }} />
              Available offers Bank Offer 5% Unlimited Cashback on Flipkart Axis
              Bank Credit Card T&C
            </Box>
          </Typography>
          <Typography variant="body2">
            <Box className={styles.childGrid3}>
              <SellIcon sx={{ color: "green" }} />
              Bank Offer10% off up to ₹750 on HDFC Bank Credit Card EMI on 3
              months tenure. Min. Txn Value: ₹7,500T&C
            </Box>
          </Typography>
          <Typography variant="body2">
            <Box className={styles.childGrid3}>
              <SellIcon sx={{ color: "green" }} />
              Bank Offer10% off up to ₹1,000 on HDFC Bank Credit Card EMI on 6
              and 9 months tenure. Min Txn Value: ₹7,500T&C
            </Box>
          </Typography>
          <Typography variant="body2">
            <Box className={styles.childGrid3}>
              <SellIcon sx={{ color: "green" }} />
              Special PriceGet extra 36% off (price inclusive of
              cashback/coupon)T&C
            </Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
            {load ? (
              <Skeleton animation="wave" height={90} />
            ) : (
              result.description
            )}
          </Typography>
          <Box className={styles.childGrid3}>
            <Typography variant="h6" color="green">
              {load ? (
                <Skeleton animation="wave" width={40} />
              ) : (
                `$${result.price}`
              )}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              {load ? (
                <Skeleton animation="wave" width={50} />
              ) : (
                `$${(1.5 * result.price).toFixed(2)}`
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              25% off
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {load ? <Skeleton animation="wave" width={90} /> : result.category}
          </Typography>
          <Button
            variant="contained"
            sx={{
              borderRadius: 4,
              padding: 2,
              my: 2,
              backgroundColor: "black",
              width: "160px",
            }}
            disabled={
              mutation.isPending ||
              load ||
              data?.ids?.map(String).includes(result?.id?.toString())
            }
            onClick={(e) => addToCart(result)}
          >
            {mutation.isPending || load ? (
              <CircularProgress size={30} />
            ) : (
              <span
                className={
                  data?.ids?.map(String).includes(result?.id?.toString())
                    ? styles.addToCart1
                    : styles.addToCart
                }
              ></span>
            )}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
