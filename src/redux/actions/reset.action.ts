import {REDUX} from "@/configs/keys.config";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {withToastForError} from "@/hofs/withToastError.hof";

export const resetStateAction = createAsyncThunk(REDUX.RESET_STATE_ACTION, withToastForError(
  async () => {
    return null
  }
));

export const resetSelectedReducersState = createAsyncThunk(REDUX.RESET_SELECTED_REDUCERS_STATE, withToastForError(
  async () => {
    return null;
  }
))