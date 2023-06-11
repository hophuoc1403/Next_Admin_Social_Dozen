import {createAsyncThunk} from "@reduxjs/toolkit";
import {withToastForError} from "@/hofs/withToastError.hof";
import {productService} from "@/services/product.service";

export const loadProducts = createAsyncThunk("products/load-products", withToastForError(
  async (queries?: IQueries): Promise<LoadProductResults> =>
    (await productService.getProducts(queries))
))

export const createProduct = createAsyncThunk("products/add-product", withToastForError(
  async (payload: ICreateProduct): Promise<any> =>
    (await productService.createProduct(payload))
))

export const updateProduct = createAsyncThunk("products/update-product", withToastForError(
  async (payload: {
    updateValues: IUpdateProduct, id: string
  }): Promise<any> => {
    const response: any = await productService.updateProduct(payload.updateValues, payload.id)
    return {
      updateValues: response.data
    }
  }
))