import {createSlice} from "@reduxjs/toolkit";
import {productCases} from "@/redux/cases/product.cases";

export interface ProductState {
  isLoading: boolean
  entities: IProduct[]
  pagination: IApiPagination
}

const initialState: ProductState = {
  entities: [],
  isLoading: false,
  pagination: {}
}

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: builder => {
    productCases(builder)
  }
})

export default productSlice.reducer