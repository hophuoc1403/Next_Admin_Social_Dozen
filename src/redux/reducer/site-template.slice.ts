import {createSlice} from "@reduxjs/toolkit";
import {siteTemplateCases} from "@/redux/cases/site-template.cases";

export interface SiteTemplateState {
  isLoading: boolean
  entities: ISiteTemplate[]
  pagination: IApiPagination
}

const initialState: SiteTemplateState = {
  entities: [],
  isLoading: false,
  pagination: {}
}

const siteTemplateSlice = createSlice({
  name: "site-templates",
  initialState,
  reducers: {},
  extraReducers: builder => {
    siteTemplateCases(builder)
  }
})

export default siteTemplateSlice.reducer