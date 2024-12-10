import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import axios from "axios";

export const Protected = () => {
  
    const navigate=useNavigate();

    axios.get(`${process.env.REACT_APP_BASEURL}/authCheck`, {
        withCredentials: true,
    }).then((response) =>{
        console.log(response);
    }).catch((error)=>{
        navigate('/signin')
    })

  return (
    <Box>
      <Outlet />
    </Box>
  );
};
