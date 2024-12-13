import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  cart_length:0,
  Total: 0,
  search:""
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    searchProduct:(state,action)=>{
      state.search=action.payload;
    },
    initializeCartLength:(state,action)=>{
      state.cart_length=action.payload.length
    },
    addToCart1:(state,action)=>{
      state.cart_length+=1;
    },
    intializeCart:(state,action)=>{
      
        state.cart=action.payload;
        state.Total=action.payload.reduce((acc, item) => {
          return acc + Number(item.price) * Number(item.count);
        },0);
    },
    
    cartIncreaseItem: (state, action) => {
      
     
      state.cart = state.cart.map((item) =>
        Number(item.id) === Number(action.payload.cartItem.id)
          ? {
              ...item,
              count: item.count ? item.count + 1 : 1,
              price: parseFloat(
                (
                  Number(item.actualPrice || 0) *
                  (item.count ? item.count + 1 : 1)
                ).toFixed(2)
              ),
            }
          : item
      );
      state.Total = parseFloat(
        (state.Total + Number(action.payload.cartItem.actualPrice)).toFixed(2)
      );
    },
    
    cartDecreaseItem: (state, action) => {
      console.log("Action Payload:", action.payload);
      state.cart_length-=1;
      state.cart = state.cart
        .map((item) => {
          if (String(item.id) === String(action.payload.cartItem.id)) {
            if (item.count > 1) {
              
              return {
                ...item,
                count: item.count - 1,
                price: parseFloat(
                  (Number(item.price) - Number(item.actualPrice)).toFixed(2)
                ),
              };
            } else {
            
              return undefined;
            }
          }
        
          return item;
        })
        .filter((item) => item !== undefined); 
    
     
      state.Total = parseFloat(
        (state.Total - Number(action.payload.cartItem.actualPrice)).toFixed(2)
      );
    
      
      console.log("Updated Cart:", state.cart);
      console.log("Updated Total:", state.Total);
    }    
    
    
  },
});

export const {searchProduct,addToCart1,initializeCartLength,intializeCart, addCart, cartIncreaseItem, cartDecreaseItem } =
  cartSlice.actions;

export default cartSlice.reducer;
