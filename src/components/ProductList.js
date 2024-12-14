import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Users.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { RenderCards } from "./RenderCards";

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const ProductList = ({ focusRef }) => {
  const { search } = useSelector((state) => state.cart);
  const debouncedInput = useDebouncedValue(search, 500);
  const loadMoreRef = useRef(null);

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["infiniteproducts", debouncedInput],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/fetchProducts?limit=8&page=${pageParam}&search=${debouncedInput}`,{
          withCredentials:true
        }
      );
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.totalPages > pages.length) {
        return pages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
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

    let loadRef = loadMoreRef.current;
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
  return (
    <Box sx={{ width: "99vw" }}>
      <Grid container spacing={2} className={styles.parentGrid}>
        {data?.pages.flatMap((page) => page.products)?.length > 0 ? (
          data?.pages
            .flatMap((page) => page.products)
            .map((product, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className={styles.grid}
                key={index}
              >
                <RenderCards
                  product={product}
                  data1={data1}
                  refetch={refetch}
                 
                />
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
  );
};
