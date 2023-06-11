import {createAsyncThunk} from "@reduxjs/toolkit";
import {withToastForError} from "@/hofs/withToastError.hof";
import {tagService
} from "@/services/tags.service";

export const loadTags = createAsyncThunk("orders/load-orders", withToastForError(
  async (queries?: IQueries): Promise<any> => (await tagService
.getOrders(queries))
))

export const updateOrder = createAsyncThunk("order/update-orders",withToastForError(
  async (data:IUpdateOrder):Promise<IUpdateOrder> => {
    await tagService
.updateOrder(data)
    return data
  }
))

