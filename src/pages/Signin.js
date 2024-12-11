import {
  Box,
  Button,
  CardMedia,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as EmailValidator from "email-validator";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";



const schema = yup.object().shape({
  email: yup
  .string()
  .test('Invalid email', (value) => {
    // Check for leading spaces and invalid email format
    return !value?.startsWith(' ') && EmailValidator.validate(value);
  })
  .required('Email is required'),
  password: yup
    .string()
    .max(15, "maximum 15 characters")
    .min(8, "minimum 8 characters")
    .required("password is required"),
});

export const Signin = () => {
  const navigate = useNavigate();
  const [hide, setHide] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(()=>{
    console.log(localStorage.getItem('auth'));
    localStorage.getItem('auth')==="true"? navigate("/users"): navigate("/signin")
  },[navigate]);

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (user) => {
      return axios.post(`${process.env.REACT_APP_BASEURL}/login`, user, {
        withCredentials: true,
      });
    },
    onSuccess: (user) => {
      toast.success("Login successful");
      navigate("/users");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Login failed");
    },
  });

  const Googlemutation = useMutation({
    mutationKey: ["google/login"],
    mutationFn: (email) => {
      return axios.post(
        `${process.env.REACT_APP_BASEURL}/google-login`,
        email,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (user) => {
      console.log(user);
      toast.success("Login successful");
      navigate("/users");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Login failed");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      email: data.email.trim(),
      password: data.password.trim(),
    });
  };

  const onSuccess = (e) => {
    console.log(e.credential);
    Googlemutation.mutate({ email: jwtDecode(e.credential)?.email });
  };
  const onError = (error) => {
    console.log(error);
  };

  return (
    <Box>
      <ToastContainer />
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              src="https://images.unsplash.com/photo-1662394028800-72d251e4bdbb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              sx={{
                height: { xs: "50vh", md: "100vh" },
                filter: "brightness(0.7)",
              }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              top: { xs: "17%", sm: "17%", md: "40%" },
              left: { xs: "8%", sm: "15%", md: "3%" },
              
            }}
            className="parentText"
          >
            Our platform is dedicated <br />
            to providing you with top notch product
            <br />
            and a seamless experience
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} className="flex-container">
          <Typography variant="h6" sx={{ mt: 2 }}>
            Sign in to Account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
            Let's get started with your 30 days free trial
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="flex-container">
            <Box sx={{ mt: 2 }}>
              <FormControl>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <TextField
                      variant="standard"
                      label="Email"
                      {...field}
                      type="text"
                      placeholder="john@gmail.com"
                      sx={{ width: { xs: "300px", sm: "500px", md: "400px" } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <FormHelperText sx={{ color: "error.main" }} className="error">
                  {errors && errors?.email?.message}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControl>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <TextField
                      variant="standard"
                      label="password"
                      type={hide ? "text" : "password"}
                      {...field}
                      placeholder="type your password here"
                      sx={{ width: { xs: "300px", sm: "500px", md: "400px" } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HttpsIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {hide ? (
                              <VisibilityIcon
                                onClick={(e) => setHide(!hide)}
                                sx={{ cursor: "pointer" }}
                              />
                            ) : (
                              <VisibilityOffIcon
                                onClick={(e) => setHide(!hide)}
                                sx={{ cursor: "pointer" }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <FormHelperText sx={{ color: "error.main" }} className="error">
                  {errors && errors?.password?.message}
                </FormHelperText>
              </FormControl>
            </Box>

            <Button
              type="submit"
              className="submitbutton"
              sx={{ width: { xs: "300px", sm: "500px", md: "400px" } }}
            >
              {mutation.isPending ? (
                <CircularProgress size={30} />
              ) : (
                <span>Sign in </span>
              )}
            </Button>
            <Box
              sx={{
                width: { xs: "300px", sm: "500px", md: "400px" },
                padding:1
              }} 
            >
              <GoogleLogin
                
                onSuccess={onSuccess}
                onError={onError}
              />
            </Box>
          </form>

          <Box className="signinBtn">
            <Typography variant="body2">
              New user ?{" "}
              <span
                style={{
                  color: "#8665eb",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={(e) => navigate("/")}
              >
                Sign up
              </span>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
