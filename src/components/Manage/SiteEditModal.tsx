import {Box, Grid, MenuItem, Stack, TextField} from "@mui/material";
import {z} from "zod";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSnackbar} from "notistack";
import {useAppDispatch} from "@/hooks/redux.hook";
import {updateSite} from "@/redux/actions/site.action";
import {useSites} from "@/hooks/useSites";
import AppDialog from "@/components/AppDialog";
import {siteTemplateService} from "@/services/site-template.service";
import Select from "@mui/material/Select";

interface SiteEditModalProps {
  isOpen: boolean
  handleClose: () => void
  siteUpdated: ISite
}


const editSiteSchema = z
  .object({
    siteName: z.string(),
    description: z.string().min(8, 'description must be at least 8 characters'),
    hostname: z.string()
  })


const SiteEditModal = ({handleClose, isOpen, siteUpdated}: SiteEditModalProps) => {

  const {enqueueSnackbar} = useSnackbar();
  const dispatch = useAppDispatch()
  const {loading} = useSites()
  const [themes, setThemes] = useState<ISiteTemplate[]>([])
  const [selectedTheme, setSelectedTheme] = useState<ISiteTemplate | null>(null)

  useEffect(() => {
    const getTemplate = async () => {
      const response: any = await siteTemplateService.getTemplates()
      setThemes(response.data)
      setSelectedTheme(response.data[0])
    }
    getTemplate()
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
    setValue
  } = useForm<z.infer<typeof editSiteSchema>>({
    resolver: zodResolver(editSiteSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const resultAction = await dispatch(updateSite({...data, template: selectedTheme._id, _id: siteUpdated._id}))
    if (updateSite.fulfilled.match(resultAction)) {
      enqueueSnackbar('ReportedPost updated successfully!', {variant: 'success'});
      reset()
    } else {
      enqueueSnackbar('ReportedPost updated failed!', {variant: 'success'})
    }
    handleClose()
  })

  useEffect(() => {
    setValue("hostname",siteUpdated.hostname)
    setValue("siteName",siteUpdated.siteName)
    setValue("description",siteUpdated.description)
  },[siteUpdated])


  return <AppDialog
    title="Update site"
    open={isOpen}
    onClose={handleClose}
    onEnter={onSubmit}
    onCancel={handleClose}
    loading={loading}
    textEnter={"Save Changes"}
  >

    <Box>
      <form onSubmit={onSubmit}>
        <Stack gap={2.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={6}>
              <TextField
                defaultValue={siteUpdated.hostname}
                label="Host name"
                InputLabelProps={{shrink: true}}
                error={!!errors.hostname}
                helperText={errors.hostname?.message}
                fullWidth
                {...register('hostname')}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <TextField
                defaultValue={siteUpdated.siteName}
                label="ReportedPost name"
                error={!!errors.siteName}
                helperText={errors.siteName?.message}
                fullWidth
                InputLabelProps={{shrink: true}}
                {...register('siteName')}
              />
            </Grid>
          </Grid>
          <TextField
            defaultValue={siteUpdated.description}
            label="Description"
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
            {...register('description')}
            type={'text'}
            multiline={true}
            InputLabelProps={{shrink: true}}
            minRows={5}
          />
        </Stack>
      </form>
      {themes.length > 0 &&
          <Select
              onChange={e => {
                if (e.target.value !== "") {
                  setSelectedTheme(() => themes.find(theme => theme._id === e.target.value))
                }
              }}
              sx={{width: "300px", mt: 2}}
              defaultValue={siteUpdated.template._id}
          >
            {themes.map(theme => (
              <MenuItem key={theme._id} value={theme._id}>
                <em>{theme.name}</em>
              </MenuItem>
            ))}
          </Select>
      }
    </Box>
  </AppDialog>
}

export default SiteEditModal