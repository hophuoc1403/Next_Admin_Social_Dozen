import {createAsyncThunk} from "@reduxjs/toolkit";
import {withToastForError} from "@/hofs/withToastError.hof";
import {cartService} from "@/services/cart.service";
import {CartState} from "@/redux/reducer/cart.slice";
import {CART_ACTION} from "@/constants/redux.contstant";

export const loadCart = createAsyncThunk("cart/load-cart", withToastForError(
  async (queries?: IQueries): Promise<ICart> => (await cartService.getCart(queries))
))

const increaseCartItemQuantity = (cart, cartItem): ICartItemUpdate[] => {
  const existedEntity = cart.entities.find((entity) => entity.productSite._id === cartItem.productSite);
  if (existedEntity) {
    return [...cart.entities.map((entity) => {
      if (entity.productSite._id !== cartItem.productSite) return {
        productSite: entity.productSite._id,
        quantity: entity.quantity
      };
      return {productSite: entity.productSite._id, quantity: entity.quantity + cartItem.quantity}
    })]
  } else {
    return [...cart.entities.map((entity) => {
      return {
        productSite: entity.productSite._id,
        quantity: entity.quantity
      }
    }), {productSite: cartItem.productSite, quantity: cartItem.quantity}]
  }
}

const decreaseCartItemQuantity = (cart, cartItem) => {
  return [...cart.entities.map((entity) => {
    if (entity.productSite._id !== cartItem.productSite) {
      return {
        productSite: entity.productSite._id,
        quantity: entity.quantity
      }
    }
    return {
      productSite: entity.productSite._id,
      quantity: entity.quantity - cartItem.quantity || 1,
    }
  })]
}

const modifyCartItemQuantity = (cart, cartItem) => {
  return [...cart.entities.map((entity) => {
    if (entity.productSite._id !== cartItem.productSite) {
      return {
        productSite: entity.productSite._id,
        quantity: entity.quantity
      }
    }
    return {
      productSite: entity.productSite._id,
      quantity: cartItem.quantity > 0 ? cartItem.quantity : 1,
    }
  })]
}

const removeCartItemByID = (cart, cartItem) => {
  return [...cart.entities.map((entity) => {
    if (entity.productSite._id !== cartItem.productSite) {
      return {
        productSite: entity.productSite._id,
        quantity: entity.quantity
      }
    }
  }).filter((entity) => !!entity)]
}

export const updateCartItem = createAsyncThunk("cart/add-to-cart", withToastForError(
  async (cartItem: ICartItemUpdate, {getState, dispatch}): Promise<void> => {
    const {cart} = getState() as {cart: CartState};
    const {action} = cartItem;
    switch (action) {
      case CART_ACTION.INCREASE: {
        dispatch(updateCart(increaseCartItemQuantity(cart, cartItem)));
        break;
      }
      case CART_ACTION.DECREASE: {
        dispatch(updateCart(decreaseCartItemQuantity(cart, cartItem)))
        break;
      }

      case CART_ACTION.MODIFY: {
        dispatch(updateCart(modifyCartItemQuantity(cart, cartItem)))
        break;
      }

      case CART_ACTION.REMOVE: {
        dispatch(updateCart(removeCartItemByID(cart, cartItem)))
        break;
      }
    }
  }
))

export const updateCart = createAsyncThunk("cart/update-cart", withToastForError(
  async (updatedCart: ICartItemUpdate[]) => (await cartService.updateCart({cartItems: updatedCart}))
))

export const deleteCart = createAsyncThunk("cart/delete-cart", withToastForError(
  async () => (await cartService.deleteCart())
))