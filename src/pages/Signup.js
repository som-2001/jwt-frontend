import {
    Box,
    Button,
    CardMedia,
    Checkbox,
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
  import PersonIcon from "@mui/icons-material/Person";
  import { Controller, useForm } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
  import "../App.css";
  import {useNavigate} from 'react-router-dom';
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import * as EmailValidator from "email-validator";
  
  import axios from "axios";
  import { useMutation } from "@tanstack/react-query";
  
  const schema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .matches(/^[a-z" "A-Z]*$/, "only letters are allowed here")
      .required("name is required"),
    email: yup
      .string()
      .trim()
      .test("invalidEmail", "invalid Email", (value) => {
        return EmailValidator.validate(value);
      })
      .required("email is required"),
    password: yup
      .string()
      .matches(/[a-z]/, "password should contain atleast one lowercase")
      .matches(/[A-Z]/, "password should contain atleast one uppercase")
      .matches(/[1-9]/, "password should contain atleast one number")
      .matches(
        /[!@#$%^&*()_+|/?,./]/,
        "password should contain atleast one special characters"
      )
      .max(15, "maximum 15 characters")
      .min(8, "minimum 8 characters")
      .required("password is required"),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match.")
      .required("confirm password is required"),
    checkbox: yup
      .boolean()
      .oneOf([true], "You must agree to the terms and conditions.")
      .required("You must agree to the terms and conditions."),
  });
  
export const Signup = () => {
    const {
      handleSubmit,
      formState: { errors },
      control,
    } = useForm({
      resolver: yupResolver(schema),
    });
  
    const navigate=useNavigate();
  
    const mutation = useMutation({
      mutationKey:['register'],
      mutationFn: (user) => {
        return axios.post(`${process.env.REACT_APP_BASEURL}/register`, user);
      },
      onSuccess: (user) => {
        console.log(user);
        toast.success("Registration successful");
      
      },
      onError: (error) => {
        console.error("Registration failed:", error);
        toast.error("Registration failed");
      },
    });
  
    const onSubmit = (data) => {
      mutation.mutate({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        confirmpassword: data.confirmpassword.trim(),
        checkbox: data.checkbox,
      });
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
              sx={{ top: { xs: "17%",sm:"17%", md: "40%" },
                left:{xs:"8%",sm:"15%",md:"3%"}
            }}
              className="parentText"
            >
              Our platform is dedicated <br />
              to providing you with top-notch product<br />and a seamless
              experience
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} className="flex-container">
            <Typography variant="h6" sx={{ mt: 2 }}>
              Create an Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
              Let's get started with your 30 days free trial
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-container">
              <Box>
                <FormControl>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="standard"
                        label="Name"
                        type="text"
                        placeholder="john doe"
                        sx={{ width: { xs: "300px", sm: "500px", md: "400px" } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  <FormHelperText className="error" sx={{ color: "error.main" }}>
                    {errors && errors?.name?.message}
                  </FormHelperText>
                </FormControl>
              </Box>
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
                        type="email"
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
                        type="password"
                        {...field}
                        placeholder="type your password here"
                        sx={{ width: { xs: "300px", sm: "500px", md: "400px" } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HttpsIcon />
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
              <Box sx={{ mt: 2 }}>
                <FormControl>
                  <Controller
                    control={control}
                    name="confirmpassword"
                    render={({ field }) => (
                      <TextField
                        variant="standard"
                        label="confirm password"
                        type="text"
                        {...field}
                        placeholder="type your confirm password here"
                        sx={{ width: { xs: "300px", sm: "500px", md: "400px" } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HttpsIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  <FormHelperText sx={{ color: "error.main" }} className="error">
                    {errors && errors?.confirmpassword?.message}
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
                  <span>Create Account</span>
                )}
              </Button>
              <Box sx={{ width: { xs: "314px", sm: "511px", md: "421px" } }}>
                <FormControl className="checkbox">
                  <Controller
                    name="checkbox"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        color="primary" // Optional: set color if needed
                      />
                    )}
                  />
                  <Typography variant="body2">
                    I've agreed with terms of service and our privacy policy
                  </Typography>
                </FormControl>
                {/* Display error message if it exists */}
                {errors?.checkbox && (
                  <FormHelperText sx={{ color: "error.main", ml: 2 }}>
                    {errors.checkbox.message}
                  </FormHelperText>
                )}
              </Box>
            </form>
  
            <Box className="signinBtn">
              <Typography variant="body2">
                Already have an accont?{" "}
                <span
                  style={{
                    color: "#8665eb",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  onClick={(e)=>navigate('/signin')}
                >
                  Sign in
                </span>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
  
  