import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import styles from "../styles/Users.module.css";
import { useDispatch } from "react-redux";
import { addToCart1 } from "../redux/slice/cartSlice";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const RenderCards = ({ product, data1, refetch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["add_to_cart"],
    mutationFn: (data) => {
      return axios.post(`${process.env.REACT_APP_BASEURL}/addtocart`, data, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Product has been added successfully.")
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });

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

  const handleNavigate = (id, category) => {
    navigate(`/viewproduct/${id}/${category}`);
  };

  return (  
    <Card
      className={styles.card}
      sx={{
        width: {
          xss: "310px",
          xs: "330px",
          sm: "390px",
          md: "360px",
          lg: "350px",
        },
      }}
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
          {product?.description?.length > 70
            ? `${product.description.substring(0, 70)}...`
            : product.description}
        </Typography>

        <Box sx={{ marginBottom: "20px" }}>
          <Stack direction="row">
            <Chip
              icon={<StarIcon sx={{ color: "green" }} />}
              label={product?.rating?.rate}
            />
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
            className={
              data1?.ids?.map(String).includes(product?.id?.toString())
                ? styles.active
                : styles.btn1
            }
            disabled={mutation.isPending || data1?.ids?.map(String).includes(product?.id?.toString())}
            onClick={(e) => addToCart(product)}
          >
            <ShoppingCartIcon sx={{ marginLeft: "5px" }} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
