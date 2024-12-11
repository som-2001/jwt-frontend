import React, { useState } from "react";
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
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import styles from "../styles/Users.module.css";
import { SearchSharp } from "@mui/icons-material";

export const Users = () => {
  const [draggedIndex, setDraggaedIndex] = useState(null);
  const [input, setInput] = useState("");
  const { data, isError, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`https://fakestoreapi.com/products`);
      return response.data;
    },
  });

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

  const onDragStart = (index) => {
    setDraggaedIndex(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (index) => {
    if (draggedIndex === null) return;
    const [draggedItem] = data.splice(draggedIndex, 1);
    data.splice(index, 0, draggedItem);
    setDraggaedIndex(null);
  };
  const handleSearch = (e) => {
    setInput(e.target.value);
  };

  const filteredData = data.filter((item, index) => {
    return item.title.toLowerCase().includes(input.toLowerCase());
  });

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
            <Grid item xs={12} sm={6} md={4} lg={3} className={styles.grid}>
              <Card
                className={
                  draggedIndex === index ? styles.draggedCard : styles.card
                }
                key={index}
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
                  sx={{ objectFit: "contain", marginBottom:"10px" }}
                />
                <CardContent sx={{ flexGrow: 1,backgroundColor:"#ffece0" }}>
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
    </Box>
  );
};
