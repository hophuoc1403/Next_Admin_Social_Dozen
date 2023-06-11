import {createAsyncThunk} from "@reduxjs/toolkit";
import {withToastForError} from "@/hofs/withToastError.hof";
import {productSiteService} from "@/services/product-site.service";

export const loadProductSites = createAsyncThunk("product-sites/load-product-sites", withToastForError(
  async (queries? : IQueries): Promise<ILoadAProductSitesResults> => (await productSiteService.getProductSite(queries))
))

export const createProductSite = createAsyncThunk("product-sites/create-product-site", withToastForError(
  async (payload: { product: string, price: number, site: string }): Promise<IProductSite> => (await productSiteService.create(payload))
))

export const updateProductSite = createAsyncThunk("product-sites/update-product-site", withToastForError(
  async (payload: {id: string, price: string}): Promise<IProductSite> => (await productSiteService.updateProductSite(payload))
))