import AppDialog from "@/components/AppDialog";

import {
  Box, Button, IconButton,
  Paper,
  Stack,
  Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import {useAppDispatch} from "@/hooks/redux.hook";
import {useRequest} from "@/hooks/useRequest";
import {useSnackbar} from "notistack";
import {useSiteTemplates} from "@/hooks/useSiteTemplates";
import {updateSiteTemplate} from "@/redux/actions/site-template.action";

const updateSiteTemplateFormSchema = z.object({
  name: z.string().refine(value => value.length > 0, {
    message: 'Name is required',
  }),
  dockerImage: z.string().refine(value => value.length > 0, {
    message: 'Docker image is required',
  }),
});

interface SiteTemplateProps {
  id: string;
  openUpdate: boolean;
  setOpenUpdate: any
}

const UpdateSiteTemplate = ({id, openUpdate, setOpenUpdate}: SiteTemplateProps) => {
  const {siteTemplates} = useSiteTemplates();
  const dispatch = useAppDispatch()
  const {enqueueSnackbar} = useSnackbar();
  const [envVars, setEnvVars] = useState<{
    index: number,
    key: string, value: string
  }[]>([])
  const [envVarKey, setEnvVarKey] = useState<string>("")
  const [envVarValue, setEnvVarValue] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<z.infer<typeof updateSiteTemplateFormSchema>>({
    resolver: zodResolver(updateSiteTemplateFormSchema),
  });

  useEffect(() => {
    const siteTemplate = siteTemplates.find(siteTemplate => siteTemplate._id === id)
    setValue("name", siteTemplate?.name)
    setValue("dockerImage", siteTemplate?.dockerImage)
    const envVars = siteTemplate?.envVar.map((item, index) => {
      return {
        index,
        key: item.key,
        value: item.value
      }
    })
    setEnvVars(envVars)
  }, [id])

  const onSubmit = handleSubmit(data => {
    const payload = {
      updateValues: {
        name: data.name,
        dockerImage: data.dockerImage,
        envVar: envVars.map(item => {
          return {key: item.key, value: item.value}
        }),
        isEnabled: true
      },
      id
    }
    if (envVars.length > 0) {
      executeUpdateSiteTemplate(payload)
    }
  })

  const [executeUpdateSiteTemplate, updateSiteTemplateStatus] = useRequest<{
    updateValues: {
      name: string;
      dockerImage: string;
      envVar: {key: string, value: string}[];
      isEnabled: boolean
    }, id: string
  }>(
    {
      request: async (payload) => dispatch(updateSiteTemplate(payload))
      ,
      onResolve: () => {
        enqueueSnackbar('ReportedPost template updated successfully', {
          variant: 'success',
        });
        setOpenUpdate(false)
      },
      onReject: (error: any) => {
        enqueueSnackbar(error.response.data.message, {variant: 'error'});
      }
    }
  )

  const handleDeleteEnvVar = (index: number) => {
    setEnvVars(envVars.filter(item => item.index !== index))
  }

  const handleAddEnvVar = () => {
    setEnvVars([{
      index: Number(Date.now().toString()),
      key: envVarKey,
      value: envVarValue
    }, ...envVars])
    setEnvVarKey("")
    setEnvVarValue("")
  }

  return (
    <AppDialog
      maxWidth={""}
      open={openUpdate}
      title={"Update site template"}
      onClose={() => setOpenUpdate(false)}
      onEnter={() => onSubmit()}
      onCancel={() => setOpenUpdate(false)}
      loading={updateSiteTemplateStatus}
    >
      <form action="#">
        <Stack spacing={2}>
          <TextField
            fullWidth
            InputLabelProps={{shrink: true}}
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField
            rows={3}
            multiline
            label="Docker Image"
            error={!!errors.dockerImage}
            helperText={errors.dockerImage?.message}
            {...register('dockerImage')}
            fullWidth
            InputLabelProps={{shrink: true}}
          />
          <Box>
            <Typography>
              Environment variable:
            </Typography>
            <Box display={"flex"} gap={1} my={2}>
              <TextField
                size={"small"}
                fullWidth
                label="Key"
                value={envVarKey}
                onChange={(e: any) => setEnvVarKey(e.target.value)}
              />
              <TextField
                fullWidth
                size={"small"}
                label="Value"
                value={envVarValue}
                onChange={(e: any) => setEnvVarValue(e.target.value)}
              />
              <Box display={"flex"}>
                <Button
                  disabled={envVarKey === "" || envVarValue === ""}
                  size={"small"}
                  variant={"contained"}
                  onClick={handleAddEnvVar}
                ><AddIcon/></Button>
              </Box>
            </Box>
            <Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{textTransform: "capitalize"}} align="left">Key</TableCell>
                      <TableCell style={{textTransform: "capitalize"}} align="left">Value</TableCell>
                      <TableCell style={{textTransform: "capitalize"}} align="left">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {envVars && envVars.map((envVar, index: number) => (
                      <TableRow
                        key={index}
                      >
                        <TableCell align="left">{envVar.key}</TableCell>
                        <TableCell align="left">{envVar.value}</TableCell>
                        <TableCell align="left">
                          <IconButton onClick={() => handleDeleteEnvVar(envVar.index)}>
                            <DeleteOutlineOutlinedIcon color={"error"} fontSize={"small"}/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography fontStyle={"italic"} fontSize={12} mt={1}>(Environment variable in the table can be
                empty)</Typography>
            </Box>
          </Box>
        </Stack>

      </form>
    </AppDialog>
  )
}

export default UpdateSiteTemplate