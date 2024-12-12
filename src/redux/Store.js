import { configureStore } from "@reduxjs/toolkit";
import cartSlice from '../redux/slice/cartSlice.js';

export const Store=configureStore({
    reducer:{
        cart:cartSlice,
      
    }
})