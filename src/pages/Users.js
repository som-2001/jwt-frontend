import React, { useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, CardMedia, Typography, CircularProgress, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import styles from '../styles/Users.module.css'

export const Users = () => {
  
  const [draggedIndex,setDraggaedIndex]=useState(null);
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

  const onDragStart=(index)=>{
      setDraggaedIndex(index);
  }

  const onDragOver=(e)=>{
    e.preventDefault();
  }

  const onDrop=(index)=>{

    if(draggedIndex===null)return;
    const [draggedItem]=data.splice(draggedIndex,1);
    data.splice(index,0,draggedItem);
    setDraggaedIndex(null);

  }

  return (
    <Box
      className={styles.parent}
    >
      <Typography variant="h4" gutterBottom color='text.secondary' sx={{my:4}}>
        Product List
      </Typography>

      <Grid container spacing={3}  className={styles.parentGrid}>
        {data.map((product,index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} className={styles.grid}>
            <Card className={draggedIndex===index?styles.draggedCard:styles.card} key={index} onDragStart={(e)=>onDragStart(index)} draggable onDrop={(e)=>onDrop(index)} onDragOver={onDragOver}>
              <CardMedia
                component="img"
                height="250"
                image={product.image}
                alt={product.title}
                sx={{ objectFit: 'contain', padding: 0 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
