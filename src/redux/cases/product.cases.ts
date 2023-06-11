import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {ProductState} from "@/redux/reducer/product.slice";
import {createProduct, loadProducts, updateProduct} from "@/redux/actions/product.action";

export const productCases = (builder: ActionReducerMapBuilder<ProductState>) => {
  loadProductsCase(builder)
  createProductCase(builder)
  updateProductCase(builder)
}
const loadProductsCase = (builder: ActionReducerMapBuilder<ProductState>) => {
  builder.addCase(loadProducts.pending, (state) => {
    state.isLoading = true
  })
  builder.addCase(loadProducts.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = action?.payload?.items
    state.pagination = action?.payload?.meta
    state.isLoading = false
  })
  builder.addCase(loadProducts.rejected, (state) => {
    state.isLoading = false
  })
}

const createProductCase = (builder: ActionReducerMapBuilder<ProductState>) => {
  builder.addCase(createProduct.pending, (state) => {
    state.isLoading = true
  })

  builder.addCase(createProduct.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = [{...action.payload.data}, ...state.entities];
    state.pagination = {
      totalDocs: state.pagination.totalDocs + 1,
      offset: 0,
      limit: state.pagination.limit,
      page: Math.ceil((state.pagination.totalDocs + 1) / state.pagination.limit),
      totalPages: Math.ceil(state.pagination.totalDocs / state.pagination.limit),
      hasPrevPage: state.pagination.page > 1,
      hasNextPage: state.pagination.page < state.pagination.totalPages,
    };
    state.isLoading = false;
  })
  builder.addCase(createProduct.rejected, (state) => {
    state.isLoading = false
  })
}

const updateProductCase = (builder: ActionReducerMapBuilder<ProductState>) => {
  builder.addCase(updateProduct.pending, (state) => {
    state.isLoading = true
  })

  builder.addCase(updateProduct.fulfilled, (state, action: Awaited<Promise<any>>) => {
    const productId = action.payload.updateValues._id
    const productIndex = state.entities.findIndex(item => item._id === productId);
    if (productIndex === -1) return;
    state.entities[productIndex] = {...state.entities[productIndex], ...action.payload.updateValues};
    state.isLoading = false
  })
  builder.addCase(updateProduct.rejected, (state) => {
    state.isLoading = false
  })
}