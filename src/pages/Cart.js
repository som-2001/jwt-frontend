import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import styles from "../styles/Cart.module.css";
import axios from "axios";
import { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  cartDecreaseItem,
  cartIncreaseItem,
  intializeCart,
  removeItem,
} from "../redux/slice/cartSlice";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { toast, ToastContainer } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const stripe = await stripePromise;

export const Cart = () => {
  const { cart, Total } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const { data, isSuccess } = useQuery({
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
    if (isSuccess) {
      dispatch(intializeCart(data.data.cart_items));
    }
  }, [dispatch, isSuccess, data]);

  const mutation = useMutation({
    mutationKey: ["product_cartincrease"],
    mutationFn: (data) => {
      return axios.post(`${process.env.REACT_APP_BASEURL}/cartincrease`, data, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      dispatch(cartIncreaseItem(res.data));
    },
  });

  const decreaseMutation = useMutation({
    mutationKey: ["product_cartdecrease"],
    mutationFn: (data) => {
      return axios.post(`${process.env.REACT_APP_BASEURL}/cartdecrease`, data, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      dispatch(cartDecreaseItem(res.data));
    },
  });

  const removeMutation = useMutation({
    mutationKey: ["product_cartremove"],
    mutationFn: (data) => {
      return axios.post(
        `${process.env.REACT_APP_BASEURL}/removeproduct`,
        data,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      toast.success("Product has been removed successfully.");
      dispatch(removeItem(res.data));
    },
  });

  const CartMutation = useMutation({
    mutationKey: ["cart"],
    mutationFn: async () => {
   
        const response = await axios.post(
          `${process.env.REACT_APP_BASEURL}/create-cart-checkout-session`,{price:Total},
          {
            withCredentials: true,
          }
        );
  
        const session = response.data;
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
  
        if (result.error) {
          console.error(result.error.message);
        }
      },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const increaseItem = (id, actualPrice) => {
    const payload = {
      id: id,
      actualPrice: actualPrice,
    };
    mutation.mutate(payload);
  };

  const decreaseItem = (id, actualPrice) => {
    const payload = {
      id: id,
      actualPrice: actualPrice,
    };
    decreaseMutation.mutate(payload);
  };

  const removecartItem = (item) => {
    const payload = {
      id: item?.id,
    };
    removeMutation.mutate(payload);
  };

  const CartProceed = () => {
    CartMutation.mutate();
  };
  return (
    <Box className={styles.Box}>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6} sx={{ marginTop: "20px" }}>
          <Typography variant="h5" sx={{ marginLeft: "40px" }}>
            Continue Shopping
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ marginLeft: "40px" }}>
            Shopping cart
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginLeft: "40px" }}
          ></Typography>

          <Box className={styles.parentBox}>
            {cart?.length > 0 ? (
              cart?.map((item, index) => (
                <Card
                  key={index}
                  className={styles.childBox}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    width: { xs: "100%", sm: "700px" },
                  }}
                >
                  <Box
                    className={styles.childContainer}
                    sx={{
                      padding: { xs: 2, sm: 3 },
                    }}
                  >
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <Typography component="div" variant="h5">
                        {item?.title.length > 50
                          ? `${item?.title.slice(0, 30)}...`
                          : item?.title}
                      </Typography>
                      <Typography
                        component="div"
                        variant="body2"
                        color="text.secondary"
                      >
                        {item?.description?.length > 90
                          ? `${item?.description?.slice(0, 180)}...`
                          : item?.description}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: "text.secondary" }}
                      >
                        {item?.category}
                      </Typography>
                      <Box sx={{ display: "flex", gap: "10px" }}>
                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={{ color: "green" }}
                        >
                          ${(item?.actualPrice * item.count).toFixed(2)}
                        </Typography>

                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={{ color: "green" }}
                        >
                          {`(${item?.count} Item)`}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 1,
                        pb: 1,
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={(e) =>
                          increaseItem(item?.id, item?.actualPrice)
                        }
                        sx={{ backgroundColor: "black" }}
                      >
                        <AddIcon />
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) =>
                          decreaseItem(item?.id, item?.actualPrice)
                        }
                        sx={{ backgroundColor: "black" }}
                      >
                        <RemoveIcon />
                      </Button>
                      <Button
                        sx={{ backgroundColor: "black" }}
                        disabled={removeMutation.isPending}
                        onClick={(e) => removecartItem(item)}
                      >
                        <RemoveShoppingCartIcon sx={{ color: "white" }} />
                      </Button>
                    </Box>
                  </Box>
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: "100%", sm: 181 },
                      height: { xs: 200, sm: "auto" },
                      objectFit: "contain",
                      marginRight: { xs: 0, sm: "10px" },
                    }}
                    image={item.image}
                    alt="Product image"
                  />
                </Card>
              ))
            ) : (
              <Typography variant="body1" align="center">
                No items in the cart
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box sx={{ padding: "20px" }}>
            <Typography variant="h6">Card type</Typography>

            <Divider sx={{ my: 2 }} />
            <Box className={styles.body1}>
              <span>subtotal</span>
              <span>{Math.abs(Total.toFixed(2))}</span>
            </Box>
            <Box className={styles.body1}>
              <span>Shipping</span>
              <span>$0</span>
            </Box>
            <Box className={styles.body1}>
              <span>Total(Tax incl.)</span>
              <span>${Math.abs(Total.toFixed(2))}</span>
            </Box>
            <Button>${Math.abs(Total.toFixed(2))}</Button>
          </Box>
          <Typography
            className={styles.btn}
            align="center"
            onClick={CartProceed}
          >
            {CartMutation.isPending ? <CircularProgress size={20}/>:<span>Checkout to Proceed</span>}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
