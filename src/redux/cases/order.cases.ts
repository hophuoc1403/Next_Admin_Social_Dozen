import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {OrderState} from "@/redux/reducer/order.slice";
import {loadTags, updateOrder} from "@/redux/actions/order.action";

export const orderCases = (builder: ActionReducerMapBuilder<OrderState>) => {
  builder.addCase(loadTags.pending, state => {
    state.isLoading = true
  })
  builder.addCase(loadTags.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.isLoading = false
    state.entities = action?.payload?.items
    state.pagination = action?.payload?.meta
  })
  builder.addCase(loadTags.rejected, (state) => {
    state.isLoading = false;
  })
  builder.addCase(updateOrder.pending, (state) => {
    state.isLoading = true
  })
  builder.addCase(updateOrder.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.isLoading = false
    state.entities = state.entities.map(item => item._id === action.payload.id ? {
      ...item,
      status: action.payload.status
    } : item)
  })
  builder.addCase(updateOrder.rejected, (state) => {
    state.isLoading = true
  })
}