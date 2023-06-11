interface ICartItem {
  productSite: IProductSite,
  quantity: number;
}

interface ICartItemUpdate {
  productSite: string,
  quantity: number;
  action: CART_ACTION
}

interface ICart {
  cartItems: ICartItem[];
}

