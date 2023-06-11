import {createSlice} from "@reduxjs/toolkit";
import {productSitesCases} from "@/redux/cases/product-sites.cases";

export interface ProductSitesState {
  isLoading: boolean;
  entities: IProductSite[];
  pagination:IApiPagination
}

const initialState: ProductSitesState = {
  isLoading: false,
  entities: [],
  pagination: {},
}

const productSitesSlice = createSlice({
  name: "product-sites",
  initialState,
  reducers: {},
  extraReducers: builder => {
    productSitesCases(builder)
  }
})

export default productSitesSlice.reducer;