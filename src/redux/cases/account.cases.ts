import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {AccountState} from "@/redux/reducer/account.slice";
import {activateAccount, loadAccount, updateAccount} from "@/redux/actions/account.action";


export const accountCases = (builder: ActionReducerMapBuilder<AccountState>) => {
  builder.addCase(loadAccount.pending, (state) => {
    state.isLoading = true
  })
  builder.addCase(loadAccount.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = action?.payload?.items
    state.pagination = action?.payload?.meta
    state.isLoading = false
  })
  builder.addCase(loadAccount.rejected, (state) => {
    state.isLoading = true
  })

  builder.addCase(updateAccount.pending, state => {
    state.isLoading = true
  })
  builder.addCase(updateAccount.rejected, (state) => {
    state.isLoading = false
  })

}