import {createSlice} from "@reduxjs/toolkit";
import {orderCases} from "@/redux/cases/order.cases";

export interface OrderState {
  isLoading:boolean
  entities:IOrder[],
  pagination:IApiPagination
}

const initialState:OrderState = {
  entities:[],
  isLoading:false,
  pagination:{}
}

const orderSlice = createSlice({
  name:"orders",
  initialState,
  reducers:{},
  extraReducers:builder => {
    orderCases(builder)
  }
})

export default orderSlice.reducer