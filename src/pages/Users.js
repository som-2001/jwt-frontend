import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  CircularProgress,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Button,
} from "@mui/material";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import styles from "../styles/Users.module.css";
import { SearchSharp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {createTheme,ThemeProvider} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useDispatch} from 'react-redux';
import {addToCart1} from '../redux/slice/cartSlice.js';
import StarIcon from "@mui/icons-material/Star";

export const Users = () => {
 
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);
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
  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["infiniteproducts"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/fetchProducts?limit=8&page=${pageParam}`
      );
      return response.data;
    },
    getNextPageParam: (_, pages) => pages.length + 1, 
  });

  const mutation = useMutation({
    mutationKey: ["add_to_cart"],
    mutationFn: (data) => {
      return axios.post(`${process.env.REACT_APP_BASEURL}/addtocart`, data, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { data: data1, refetch } = useQuery({
    queryKey: ["cart_id"],
    queryFn: () => {
      return axios.get(`${process.env.REACT_APP_BASEURL}/getCartId`, {
        withCredentials: true,
      });
    },
    select: (data) => data.data,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.8 }
    );

    let loadRef=loadMoreRef.current
    if (loadRef) {
      observer.observe(loadRef);
    }

    return () => {
      if (loadRef) {
        observer.unobserve(loadRef);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <Box className={styles.loader}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <h1>Error loading products...</h1>;
  }

  const addToCart = async (data) => {
    const payload = {
      id: String(data.id),
      count: 1,
      title: data.title,
      image: data.image,
      category: data.category,
      actualPrice: data.price,
      price: data.price,
      description: data.description,
    };
    mutation.mutate(payload);
    dispatch(addToCart1());
  };

  const handleSearch = (e) => {
    setInput(e.target.value);
  };

  const filteredData = data?.pages
  .flatMap((page)=>page.products)
  .filter((item) =>
    item.title.toLowerCase().includes(input.toLowerCase())
  );


  const handleNavigate = (id, category) => {
    navigate(`/viewproduct/${id}/${category}`);
  };

  

  return (
    <ThemeProvider theme={theme}>
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

      <Grid container spacing={2} className={styles.parentGrid}>
        {filteredData.length > 0 ? (
          filteredData.map((product, index) => (
            <Grid item xss={12} xs={12} sm={6} md={4} lg={3} className={styles.grid} key={index}>
              <Card
                className={styles.card}
                sx={{width:{xss:"310px",xs:"330px",sm:"390px",md:"360px",lg:"370px"}}}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={product.image}
                  alt={product.title}
                  sx={{ objectFit: "contain", marginBottom: "10px" }}
                />
                <CardContent sx={{ flexGrow: 1, backgroundColor: "#f9f9f8" }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {product?.title?.length > 20
                      ? `${product.title.substring(0, 20)}...`
                      : product.title}
                  </Typography>

                  <Box className={styles.gap}>
                    <Chip label={product.category} />
                    <Typography variant="h6" color="green">
                      ${product.price}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product?.description?.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </Typography>
                
                <Box sx={{marginBottom:"20px"}}>
                  <Stack direction="row">
                  <Chip icon={<StarIcon sx={{color:"green"}}/>} label={product?.rating?.rate} />
                  </Stack>
                </Box> 

                <Box className={styles.grid}>
                  <Button
                    variant="contained"
                    className={styles.btn}
                    onClick={(e) => handleNavigate(product.id, product.category)}
                  >
                    View
                  </Button>

                  <Button
                    variant="contained"
                    className={data1?.ids?.map(String).includes(product?.id?.toString())?styles.active:styles.btn1}
                    disabled={data1?.ids?.map(String).includes(product?.id?.toString())}
                    onClick={(e) => addToCart(product)}
                  >
                    <ShoppingCartIcon sx={{marginLeft:'5px'}}/>
                  </Button>
                </Box>  
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Box className={styles.center}>
            <Typography variant="body1" align="center" color="text.secondary">
              No Product with this name
            </Typography>
          </Box>
        )}
      </Grid>
      <Box ref={loadMoreRef} className={styles.infiniteScrolling}>
        {isFetchingNextPage && <CircularProgress />}
      </Box>
    </Box>
    </ThemeProvider>
  );
};
