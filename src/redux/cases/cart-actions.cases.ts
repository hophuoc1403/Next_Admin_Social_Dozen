import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {CartState} from "@/redux/reducer/cart.slice";
import {deleteCart, loadCart, updateCart} from "@/redux/actions/cart.action";

export const cartActionsCases = (builder: ActionReducerMapBuilder<CartState>) => {
  builder.addCase(loadCart.pending, (state) => {
    state.isLoading = true;
  })
  builder.addCase(loadCart.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = action?.payload?.data?.cartItems;
    state.isLoading = false;
  })
  builder.addCase(loadCart.rejected, (state) => {
    state.isLoading = false;
  })

  builder.addCase(updateCart.pending, (state) => {
    state.isLoading = true;
  })
  builder.addCase(updateCart.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = action?.payload?.data.cartItems;
    state.isLoading = false;
  })
  builder.addCase(updateCart.rejected, (state) => {
    state.isLoading = false;
  })

  builder.addCase(deleteCart.pending, (state) => {
    state.isLoading = true;
  })
  builder.addCase(deleteCart.fulfilled, (state) => {
    state.entities = [];
    state.isLoading = false;
  })
  builder.addCase(deleteCart.rejected, (state) => {
    state.isLoading = false;
  })
}