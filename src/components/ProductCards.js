import {
    Box,
    Card,
    CardMedia,
    Typography,
    Grid,
    CardContent,
    Button,
    Skeleton,
  } from "@mui/material";
  import Chip from "@mui/material/Chip";
  import Stack from "@mui/material/Stack";
  import { useNavigate } from "react-router-dom";
  import styles from "../styles/ProductCards.module.css";
  
  export const ProductCards = ({ result, loading1 }) => {
    const navigate = useNavigate();
  
    const ViewProduct = (category, id) => {
      navigate(`/viewproduct/${id}/${category}`);
    };
  
    return (
      <Box>
    
        <Grid container spacing={2} sx={{ my: 2 }}>
          {result?.map((data, index) => (
            <Grid item xs={12} lg={3} key={index} className={styles.parentGrid}>
              <Card sx={{ width: "300px" }}>
                {loading1 ? (
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    height={200}
                    width="100%"
                    sx={{ borderRadius: 2 }}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    src={data.image}
                    sx={{ objectFit: "contain" }}
                    className={styles.image}
                  />
                )}
  
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ height: "60px" }}
                  >
                    {loading1 ? (
                      <Skeleton animation="wave" />
                    ) : (
                      `${data.title.slice(0, 40)}...`
                    )}
                  </Typography>
                  <Stack direction="row">
                    <Chip
                      label={
                        loading1 ? (
                          <Skeleton animation="wave" width="90%" />
                        ) : (
                          data?.category
                        )
                      }
                      sx={{ margin: "5px 0px 20px 0px" }}
                    />
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", height: "120px" }}
                  >
                    {loading1 ? (
                      <Skeleton animation="wave" width="90%" height="90%" />
                    ) : (
                      `${data.description.slice(0, 200)}...`
                    )}
                  </Typography>
                  <Box className="price">
                    <Typography variant="body1" sx={{ color: "green", my: 2 }}>
                      {loading1 ? (
                        <Skeleton animation="wave" width="30%" />
                      ) : (
                        `$${data.price}`
                      )}
                    </Typography>
                    <Button
                      className={styles.btn}
                      variant="contained"
                      sx={{ borderRadius: 5 }}
                      onClick={(e) => ViewProduct(data?.category, data?.id)}
                    >
                      View Product
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  