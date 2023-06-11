import {AsyncThunkPayloadCreator} from "@reduxjs/toolkit";

export function withToastForError<Returned, Args, ThunkApiConfig>(payloadCreator: AsyncThunkPayloadCreator<Returned, Args, ThunkApiConfig>) {
  return async (args, thunkAPI) => {
    try {
      return await payloadCreator(args, thunkAPI);
    } catch (error) {
      throw error;
    }
  };
}

