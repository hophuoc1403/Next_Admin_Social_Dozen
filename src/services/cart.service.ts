import {ApiBaseService} from "@/services/base.service";

export class CartService extends ApiBaseService {
  public async getCart(queries?: IQueries) {
    return (await this.httpClient.get<ICart>("/carts/my-cart", queries))?.data;
  }
  public async updateCart(payload: {cartItems: ICartItemUpdate[]}) {
    return (await this.httpClient.post<ICart>("/carts", payload))?.data;
  }

  public async deleteCart() {
    return (await this.httpClient.delete("/carts/my-cart"))?.data;
  }
}

export const cartService = new CartService();