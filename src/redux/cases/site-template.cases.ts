import {ActionReducerMapBuilder} from "@reduxjs/toolkit";
import {SiteTemplateState} from "@/redux/reducer/site-template.slice";
import {
  createSiteTemplate,
  deleteSiteTemplate,
  loadSiteTemplates,
  updateSiteTemplate
} from "@/redux/actions/site-template.action";

export const siteTemplateCases = (builder: ActionReducerMapBuilder<SiteTemplateState>) => {
  loadProductsCase(builder)
  createSiteTemplateCase(builder)
  updateSiteTemplateCase(builder)
  deleteSiteTemplateCase(builder)
}
const loadProductsCase = (builder: ActionReducerMapBuilder<SiteTemplateState>) => {
  builder.addCase(loadSiteTemplates.pending, (state) => {
    state.isLoading = true
  })
  builder.addCase(loadSiteTemplates.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = action?.payload?.data
    state.pagination = action?.payload?.paginationOptions
    state.isLoading = false
  })
  builder.addCase(loadSiteTemplates.rejected, (state) => {
    state.isLoading = false
  })
}

const createSiteTemplateCase = (builder: ActionReducerMapBuilder<SiteTemplateState>) => {
  builder.addCase(createSiteTemplate.pending, (state) => {
    state.isLoading = true
  })

  builder.addCase(createSiteTemplate.fulfilled, (state, action: Awaited<Promise<any>>) => {
    state.entities = [{...action.payload.data}, ...state.entities];
    state.pagination = {
      totalDocs: state.pagination.totalDocs + 1,
      offset: 0,
      limit: state.pagination.limit,
      page: Math.ceil((state.pagination.totalDocs + 1) / state.pagination.limit),
      totalPages: Math.ceil(state.pagination.totalDocs / state.pagination.limit),
      hasPrevPage: state.pagination.page > 1,
      hasNextPage: state.pagination.page < state.pagination.totalPages,
    };
    state.isLoading = false
  })
  builder.addCase(createSiteTemplate.rejected, (state) => {
    state.isLoading = false
  })
}

const updateSiteTemplateCase = (builder: ActionReducerMapBuilder<SiteTemplateState>) => {
  builder.addCase(updateSiteTemplate.pending, (state) => {
    state.isLoading = true
  })

  builder.addCase(updateSiteTemplate.fulfilled, (state, action: Awaited<Promise<any>>) => {
    const siteTemplateId = action.payload.updateValues._id
    const siteTemplateIndex = state.entities.findIndex(item => item._id === siteTemplateId);
    if (siteTemplateIndex === -1) return;
    state.entities[siteTemplateIndex] = {...state.entities[siteTemplateIndex], ...action.payload.updateValues};
    state.isLoading = false
  })
  builder.addCase(updateSiteTemplate.rejected, (state) => {
    state.isLoading = false
  })
}

const deleteSiteTemplateCase = (builder: ActionReducerMapBuilder<SiteTemplateState>) => {
  builder.addCase(deleteSiteTemplate.pending, (state) => {
    state.isLoading = true
  })

  builder.addCase(deleteSiteTemplate.fulfilled, (state, action: Awaited<Promise<any>>) => {
    const siteTemplateId = action.payload.id
    state.entities = state.entities.filter(item => item._id !== siteTemplateId)
    state.pagination = {
      totalDocs: state.pagination.totalDocs - 1,
      offset: 0,
      limit: state.pagination.limit,
      page: Math.ceil((state.pagination.totalDocs - 1) / state.pagination.limit),
      totalPages: Math.ceil(state.pagination.totalDocs / state.pagination.limit),
      hasPrevPage: state.pagination.page > 1,
      hasNextPage: state.pagination.page < state.pagination.totalPages,
    }
    state.isLoading = false
  })
  builder.addCase(deleteSiteTemplate.rejected, (state) => {
    state.isLoading = false
  })
}