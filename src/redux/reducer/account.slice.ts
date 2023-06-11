import {createSlice} from "@reduxjs/toolkit";
import {accountCases} from "@/redux/cases/account.cases";

export interface AccountState {
  isLoading:boolean
  entities:IAccount[]
  pagination:IApiPagination
  isHostSite:boolean
}

const initialState:AccountState = {
  entities:[],
  isLoading:false,
  pagination:{},
  isHostSite:false
}

const accountSlice = createSlice({
  name:"accounts",
  initialState,
  reducers:{
    setHostSite : (state) => {
      state.isHostSite = true
    }},
  extraReducers:builder => {
    accountCases(builder)
  }
})
export const {setHostSite} = accountSlice.actions
export default accountSlice.reducer