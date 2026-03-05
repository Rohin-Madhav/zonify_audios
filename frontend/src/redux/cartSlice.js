import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemLocal: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find((item) => item._id === product._id);

      state.totalQuantity++;

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }
    },

    removeItemLocal: (state, action) => {
      const id = action.payload;

      const existingItem = state.items.find((item) => item._id === id);

      if (!existingItem) return;

      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item._id !== id);
      } else {
        existingItem.quantity--;
      }
    },

    setCartFromServer: (state, action) => {
      state.items = action.payload;
      state.totalQuantity = action.payload.reduce(
        (total, item) => total + item.quantity,
        0,
      );
    },
  },
});

export const { addItemLocal, removeItemLocal, setCartFromServer } =
  cartSlice.actions;

export default cartSlice.reducer;
