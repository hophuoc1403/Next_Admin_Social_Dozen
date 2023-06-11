import {ApiBaseService} from "@/services/base.service";

export class ProductService extends ApiBaseService {
  public async createProduct(payload: ICreateProduct) {
    return (await this.httpClient.post("/products", payload))?.data;
  }

  public async getProducts(queries?: IQueries, filter?: IFilter) {
    return (await this.httpClient.get<LoadProductResults>(!filter ? "/posts" : `/products?k=${filter?.k}&name=${filter?.name}&slug=${filter?.slug}&v=${filter?.v}`, queries))?.data;
  }

  public async updateProduct(payload: IUpdateProduct, id: string) {
    return (await this.httpClient.patch(`/products/${id}`, payload))?.data;
  }

  public async deletePost(id:number){
    return  (await this.httpClient.delete(`/posts/delete/${id}`))?.data;
  }

}

export const productService = new ProductService();