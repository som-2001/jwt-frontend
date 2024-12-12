import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
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

export const Users = () => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);

  // Infinite query to fetch data page-by-page
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
        `https://fakestoreapi.com/products?limit=8&page=${pageParam}`
      );
      return response.data;
    },
    getNextPageParam: (_, pages) => pages.length + 1, // Increment page number
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
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
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
  };

  const onDragStart = (index) => {
    setDraggedIndex(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (index) => {
    if (draggedIndex === null) return;
    const [draggedItem] = data.pages.flat().splice(draggedIndex, 1);
    data.pages.flat().splice(index, 0, draggedItem);
    setDraggedIndex(null);
  };

  const handleSearch = (e) => {
    setInput(e.target.value);
  };

  const filteredData = data.pages.flat().filter((item) =>
    item.title.toLowerCase().includes(input.toLowerCase())
  );

  const handleNavigate = (id, category) => {
    navigate(`/viewproduct/${id}/${category}`);
  };

  return (
    <Box className={styles.parent}>
      <Box className={styles.search}>
        <Typography
          variant="h4"
          gutterBottom
          color="text.secondary"
          sx={{ my: 4, fontSize: { xs: "1.2rem", sm: "1.9rem" } }}
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
                <SearchSharp />
              </InputAdornment>
            ),
          }}
          onChange={handleSearch}
        />
      </Box>

      <Grid container spacing={3} className={styles.parentGrid}>
        {filteredData.length > 0 ? (
          filteredData.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} className={styles.grid} key={index}>
              <Card
                className={draggedIndex === index ? styles.draggedCard : styles.card}
                onDragStart={(e) => onDragStart(index)}
                draggable
                onDrop={(e) => onDrop(index)}
                onDragOver={onDragOver}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={product.image}
                  alt={product.title}
                  sx={{ objectFit: "contain", marginBottom: "10px" }}
                />
                <CardContent sx={{ flexGrow: 1, backgroundColor: "#ffece0" }}>
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

                  <Button
                    variant="contained"
                    className={styles.btn}
                    onClick={(e) => handleNavigate(product.id, product.category)}
                  >
                    View
                  </Button>

                  <Button
                    variant="contained"
                    className={styles.btn1}
                    disabled={data1?.ids?.map(String).includes(product?.id?.toString())}
                    onClick={(e) => addToCart(product)}
                  >
                    Add to cart
                  </Button>
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

      <Box ref={loadMoreRef} className={styles.loader}>
        {isFetchingNextPage && <CircularProgress />}
      </Box>
    </Box>
  );
};
