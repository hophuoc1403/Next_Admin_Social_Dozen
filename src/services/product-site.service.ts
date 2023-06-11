import {ApiBaseService} from "@/services/base.service";

export class ProductSiteService extends ApiBaseService {
  public async create(payload: { product: string, price: number, site: string }) {
    return (await this.httpClient.post<Promise<IProductSite>>('/product-site', payload))?.data
  }

  public async getProductSite(queries?: IQueries) {
    return (await this.httpClient.get<ILoadAProductSitesResults>(`/product-site`, queries, {
       isNotRequiredAuthentication: true
    }))?.data
  }

  public async getProductSiteById(id: string) {
    return (await this.httpClient.get(`/product-site/${id}`))?.data
  }

  public async updateProductSite(payload: {id: string, price: string}) {
    return (await this.httpClient.patch<Promise<IProductSite>>(`/product-site/${payload.id}`, {price: payload.price}))?.data
  }
}

export const productSiteService = new ProductSiteService()