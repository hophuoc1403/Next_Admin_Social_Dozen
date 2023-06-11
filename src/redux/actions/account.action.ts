import {createAsyncThunk} from "@reduxjs/toolkit";
import {withToastForError} from "@/hofs/withToastError.hof";
import {accountService} from "@/services/account.service";

export const loadAccount = createAsyncThunk("accounts/load-accounts", withToastForError(
  async (queries?: IQueries): Promise<ILoadAccountResults> =>
    (await accountService.getAccounts(queries))
))

export const updateAccount = createAsyncThunk("accounts/update-account", withToastForError(
  async ({accountInfo, _id}: { accountInfo: IUpdateProfilePayload, _id: string }) : Promise<any> =>
    await accountService.adminUpdateProfile(_id, accountInfo)
))

export const activateAccount = createAsyncThunk("accounts/activate-account",withToastForError(
  async (id:string) : Promise<string> => {
    await accountService.activeAccount({id})
    return id
  }
))
