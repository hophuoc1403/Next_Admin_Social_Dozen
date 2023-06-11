import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {SiteState} from "@/redux/reducer/site.slice";
import {loadPost} from "@/redux/actions/site.action";

export const siteCases = (builder: ActionReducerMapBuilder<SiteState>) => {
  builder.addCase(loadPost.pending, (state) => {
    state.isLoading = true
  })
  builder.addCase(loadPost.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = action?.payload?.items
    state.isLoading = false
    state.pagination = action?.payload?.meta
  })
  builder.addCase(loadPost.rejected, (state) => {
    state.isLoading = false
  })

}