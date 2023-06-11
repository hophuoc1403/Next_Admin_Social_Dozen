import {createSlice} from "@reduxjs/toolkit";
import {cartActionsCases} from "@/redux/cases/cart-actions.cases";

export interface CartState {
  isLoading: boolean;
  entities: ICartItem[];
  selectedEntities: ICartItem[];
  pagination: IApiPagination;
}

const initialState: CartState = {
  isLoading: false,
  entities: [],
  selectedEntities: [],
  pagination: {}
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    onSelectEntities: (state, action: { payload: { cartItem: ICartItem[],isBind?:boolean } }) => {
      state.selectedEntities =!action.payload.isBind ?  [...action.payload.cartItem] : [...state.selectedEntities,...action.payload.cartItem]
    },
    onUpdateQuantityCartItem: (state, action: { payload: { id: string, quantity: number } }) => {
      state.selectedEntities = state.selectedEntities.map(state => {
        if (state.productSite._id === action.payload.id) {
          return {...state, quantity: action.payload.quantity}
        }
        return state
      })
      state.entities = state.entities.map(state => {
        if (state.productSite._id === action.payload.id) {
          return {...state, quantity: action.payload.quantity}
        }
        return state
      })
    },
    onDeleteSelectedEntity : (state,action:{payload:{id:string}}) => {
      state.selectedEntities = state.selectedEntities.filter(item => item.productSite._id !== action.payload.id)
    },
    onSetEmptySelectedEntity:(state) => {
      state.selectedEntities = []
    }
  },
  extraReducers: builder => {
    cartActionsCases(builder);
  }
})

export const {onSelectEntities, onUpdateQuantityCartItem,onDeleteSelectedEntity,onSetEmptySelectedEntity} = cartSlice.actions;

export default cartSlice.reducer;