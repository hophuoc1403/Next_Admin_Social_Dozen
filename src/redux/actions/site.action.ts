import {createAsyncThunk} from "@reduxjs/toolkit";
import {withToastForError} from "@/hofs/withToastError.hof";
import {siteService} from "@/services/reportedPost.service";


export const loadPost = createAsyncThunk("sites/load-sites", withToastForError(
  async (queries?: IQueries): Promise<any> =>
    (await siteService.getPosts(queries))
))


