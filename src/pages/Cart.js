import { Box, Button, Card, CardContent, CardMedia, Divider, Grid, Typography } from "@mui/material";
import styles from "../styles/Cart.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { cartDecreaseItem, cartIncreaseItem, intializeCart } from "../redux/slice/cartSlice";

export const Cart = () => {
  
  const { cart,Total } = useSelector((state) => state.cart);

  const dispatch=useDispatch();
  const [total,setTotal]=useState(0);
  // const [cart,setCart]=useState([]);
 
  // useEffect(()=>{
  //   axios.get(`${process.env.REACT_APP_BASEURL}/getUserCart`, {
  //       withCredentials: true,
  //     }).then(res=>{
  //       console.log(res.data.cart_items);
  //       setCart(res.data.cart_items)
  //       const total = res.data.cart_items.reduce((acc, item) => {
  //           return acc + (Number(item.price) * Number(item.count));
  //         }, 0);
  //         setTotal(total);
       
  //     }).catch(error=>{
  //       console.log(error)
  //     })
  // },[]);

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
      // console.log(data.data.cart_items);
      // setCart(data.data.cart_items);
      dispatch(intializeCart(data.data.cart_items));
  
      // Calculate total
      const total = data.data.cart_items.reduce((acc, item) => {
        return acc + Number(item.price) * Number(item.count);
      }, 0);

      setTotal(total);
    }
  }, [dispatch,isSuccess, data]); // Dependencies
  

  const mutation=useMutation({
    mutationKey:["product_cartincrease"],
    mutationFn:(data)=>{
      return  axios.post(
        `${process.env.REACT_APP_BASEURL}/cartincrease`,
          data,
        {
          withCredentials: true,
        })
    },
    onSuccess:(res)=>{
      // setCart((cartItem) =>
      //   cartItem.map((item) =>
      //     String(item.id) === String(res.data.cartItem.id)
      //       ? {
      //           ...item,
      //           count: item.count ? item.count + 1 : 1, 
      //           price: parseFloat(
      //             (
      //               Number(item.actualPrice || 0) *
      //               ((item.count || 0) + 1)
      //             ).toFixed(2) 
      //           ),
      //         }
      //       : item
      //   )
      // );
      // setTotal((prev)=>prev+Number(res.data.cartItem.actualPrice))
      dispatch(cartIncreaseItem(res.data));
    }
  })

  const decreaseMutation=useMutation({
    mutationKey:["product_cartdecrease"],
    mutationFn:(data)=>{
      return  axios.post(
        `${process.env.REACT_APP_BASEURL}/cartdecrease`,
          data,
        {
          withCredentials: true,
        })
    },
    onSuccess:(res)=>{
    //   setCart((cartItem) =>
    //     cartItem
    //     .map((item) =>
    //       String(item.id) === String(res.data.cartItem.id)
    //         ? item.count > 1 ? {
    //               ...item,
    //               count: item.count - 1,
    //               price: (item.price - item.actualPrice).toFixed(2), 
    //             }
    //           : 'remove'
    //         : item
    //     ).filter((item) => item !== 'remove')
    // )
    // setTotal((prev)=>prev-Number(res.data.cartItem.actualPrice))
    dispatch(cartDecreaseItem(res.data));
    }
  })
  const increaseItem = (id, actualPrice) => {
    
    const payload={
      id:id,
      actualPrice:actualPrice
    }
      mutation.mutate(payload);
     
    };

    const decreaseItem = (id, actualPrice) => {
      
  
      const payload={
        id:id,
        actualPrice:actualPrice
      }
      decreaseMutation.mutate(payload);
    };

  return (
    <Box sx={{minHeight:"84vh",marginTop:'30px'}}>
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
          >
           
          </Typography>

          <Box
      sx={{
        my: 2,
        padding: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {cart?.length > 0 ? (
        cart?.map((item, index) => (
          <Card
            key={index}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              my: 2,
              justifyContent: "space-between",
              width: { xs: "100%", sm: "700px" },
              maxWidth: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
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
                    ${(item?.actualPrice*item.count).toFixed(2)}
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
                  onClick={(e) => increaseItem(item?.id, item?.actualPrice)}
                >
                  <AddIcon />
                </Button>
                <Button
                  variant="contained"
                  onClick={(e) => decreaseItem(item?.id, item?.actualPrice)}
                >
                  <RemoveIcon />
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
        </Grid>
      </Grid>
    </Box>
  );
};
