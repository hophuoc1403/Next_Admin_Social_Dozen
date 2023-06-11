import {createAsyncThunk} from "@reduxjs/toolkit";
import {withToastForError} from "@/hofs/withToastError.hof";
import {siteTemplateService} from "@/services/site-template.service";

export const loadSiteTemplates = createAsyncThunk("site-templates/load-site-templates", withToastForError(
  async (queries?: IQueries): Promise<any> =>
    (await siteTemplateService.getTemplates(queries))
))

export const createSiteTemplate = createAsyncThunk("site-templates/add-site-template", withToastForError(
  async (payload: ICreateSiteTemplate): Promise<any> =>
    (await siteTemplateService.createSiteTemplate(payload))
))

export const updateSiteTemplate = createAsyncThunk("site-templates/update-site-template", withToastForError(
  async (payload: {
    updateValues: IUpdateSiteTemplate, id: string
  }): Promise<any> => {
    const response: any = await siteTemplateService.updateSiteTemplate(payload.updateValues, payload.id)
    return {
      updateValues: response.data
    }
  }
))

export const deleteSiteTemplate = createAsyncThunk("site-templates/delete-site-template", withToastForError(
  async (id: string): Promise<string> => {
    await siteTemplateService.deleteSiteTemplate(id)
    return id
  }
))
