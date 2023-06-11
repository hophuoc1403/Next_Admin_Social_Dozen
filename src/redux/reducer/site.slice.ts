import {createSlice} from "@reduxjs/toolkit";
import {siteCases} from "@/redux/cases/site.cases";

export interface SiteState {
  isLoading:boolean
  entities:ISite[]
  pagination:IApiPagination
  currentSite:ISite | null
}

const initialState:SiteState = {
  entities:[],
  isLoading:false,
  pagination:{},
  currentSite:null
}

const siteSlice = createSlice({
  name:"sites",
  initialState,
  reducers:{},
  extraReducers:builder => {
    siteCases(builder)
  }
})

export default siteSlice.reducer