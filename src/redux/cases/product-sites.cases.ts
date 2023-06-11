import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {ProductSitesState} from "@/redux/reducer/product-site.slice";
import {createProductSite, loadProductSites, updateProductSite} from "@/redux/actions/product-sites.action";

export const productSitesCases = (builder: ActionReducerMapBuilder<ProductSitesState>) => {
  builder.addCase(loadProductSites.pending, (state) => {
    state.isLoading = true;
  })
  builder.addCase(loadProductSites.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = action?.payload?.data;
    state.pagination = action?.payload?.paginationOptions
    state.isLoading = false;
  })
  builder.addCase(loadProductSites.rejected, (state) => {
    state.isLoading = false;
  })
  builder.addCase(createProductSite.pending, (state) => {
    state.isLoading = true;
  })
  builder.addCase(createProductSite.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = [action?.payload.data,...state.entities];
    state.isLoading = false;
  })
  builder.addCase(createProductSite.rejected, (state) => {
    state.isLoading = false;
  })
  builder.addCase(updateProductSite.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = state.entities.map((entity) => {
      if(entity._id === action?.payload?.data?._id){
        return action?.payload?.data
      }
      return entity
    })
    state.isLoading = false;
  })
  builder.addCase(updateProductSite.rejected, (state, action: Awaited<Promise<any>>) => {
    state.isLoading = false;
  })
}

