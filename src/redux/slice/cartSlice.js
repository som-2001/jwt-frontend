import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  cart_id: [],
  Total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    intializeCart:(state,action)=>{
      
        state.cart=action.payload;
        state.Total=action.payload.reduce((acc, item) => {
          return acc + Number(item.price) * Number(item.count);
        },0);
    },
    addCart: (state, action) => {
      state.cart = state.cart_id.includes(action.payload.id)
        ? state.cart
        : [...state.cart, action.payload];
      state.cart_id = [...state.cart_id, action.payload.id];
      state.Total = state.Total + action.payload.price;
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
    
      // Update the total price
      state.Total = parseFloat(
        (state.Total + Number(action.payload.cartItem.actualPrice)).toFixed(2)
      );
    },
    
    cartDecreaseItem: (state, action) => {
      console.log("Action Payload:", action.payload);
    
      // Update cart items
      state.cart = state.cart
        .map((item) => {
          if (String(item.id) === String(action.payload.cartItem.id)) {
            if (item.count > 1) {
              // Decrease the count and update the price
              return {
                ...item,
                count: item.count - 1,
                price: parseFloat(
                  (Number(item.price) - Number(item.actualPrice)).toFixed(2)
                ),
              };
            } else {
              // Mark for removal by returning `undefined`
              return undefined;
            }
          }
          // Keep other items unchanged
          return item;
        })
        .filter((item) => item !== undefined); // Remove items marked for deletion
    
      // Update total price
      state.Total = parseFloat(
        (state.Total - Number(action.payload.cartItem.actualPrice)).toFixed(2)
      );
    
      // Debugging logs
      console.log("Updated Cart:", state.cart);
      console.log("Updated Total:", state.Total);
    }    
    
    
  },
});

export const {intializeCart, addCart, cartIncreaseItem, cartDecreaseItem } =
  cartSlice.actions;

export default cartSlice.reducer;
