import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import cartReducer from '../reducer/cart.slice';
import themeReducer from '../reducer/theme.slice';
import siteReducer from '../reducer/site.slice';
import accountReducer from '../reducer/account.slice';
import productSiteReducer from '../reducer/product-site.slice';
import productSlice from '../reducer/product.slice';
import siteTemplateSlice from '../reducer/site-template.slice'
import orderSlice from '../reducer/order.slice';
import {REDUX} from "@/configs/keys.config";
import {CART, THEME, PRODUCT_SITES, SITES,ACCOUNTS,ORDERS, PRODUCTS, SITE_TEMPLATES} from "@/constants/redux.contstant";
import {shortenObject} from "@/utils";

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
};

const reducers = {
  [CART]: cartReducer,
  [THEME]: themeReducer,
  [PRODUCT_SITES]: productSiteReducer,
  [ACCOUNTS]:accountReducer,
  [SITES]: siteReducer,
  [PRODUCTS]: productSlice,
  [SITE_TEMPLATES]: siteTemplateSlice,
  [ORDERS]: orderSlice,
}

const specifiedResetReducersState = [CART, PRODUCT_SITES, SITES,ACCOUNTS,ORDERS];

const combinedReducer = combineReducers(reducers);

const rootReducer = (state, action) => {
  switch (action.type) {
    case REDUX.RESET_STATE_ACTION_FULFILLED: {
      state = {} as RootState;
      break;
    }
    case REDUX.RESET_SELECTED_REDUCERS_STATE_FULFILLED: {
      state = shortenObject(state, specifiedResetReducersState) as RootState;
      break;
    }
  }
  return combinedReducer(state, action);
}
export type RootState = ReturnType<typeof rootReducer>

export const persistedReducer = persistReducer(persistConfig, rootReducer);

