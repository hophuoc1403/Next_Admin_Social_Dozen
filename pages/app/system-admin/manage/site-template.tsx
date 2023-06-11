import SidebarLayout from "@/layouts/SidebarLayout";
import {
  Box, Button, IconButton,
  Paper, Switch, Tooltip,
  Typography
} from "@mui/material";
import BuffWrapper from "@/components/wrapper/BuffWrapper";
import {useEffect, useState} from "react";
import {useAppDispatch} from "@/hooks/redux.hook";
import {loadProducts} from "@/redux/actions/product.action";
import {GridColDef} from "@mui/x-data-grid";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import {StyledTable} from "../../cart";
import {useSiteTemplates} from "@/hooks/useSiteTemplates";
import {deleteSiteTemplate, loadSiteTemplates} from "@/redux/actions/site-template.action";
import {useConfirm} from "material-ui-confirm";
import {useSnackbar} from "notistack";
import AddSiteTemplate from "@/content/Management/SiteTemplates/AddSiteTemplate";
import UpdateSiteTemplate from "@/content/Management/SiteTemplates/UpdateSiteTemplate";
import NoData from "@/content/shared/NoData";

const ManageSiteTemplate = () => {
  const {siteTemplates, loading, pagination} = useSiteTemplates();
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const [siteTemplateId, setSiteTemplateId] = useState<string>("")
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    dispatch(loadSiteTemplates({}))
  }, [])

  const column: GridColDef<ISiteTemplate>[] = [
    {
      field: "name",
      align: "left",
      headerName: "Name",
      flex: 1,
      headerAlign: "left",
      sortable: false,
      filterable: false,
    },
    {
      field: "dockerImage",
      align: "left",
      headerName: "Docker Image",
      flex: 1,
      headerAlign: "left",
      sortable: false,
      filterable: false,
    },
    {
      field: "envVar",
      align: "left",
      headerName: "Environment Variable",
      flex: 1,
      headerAlign: "left",
      sortable: false,
      filterable: false,
      renderCell: (param) => (<Typography
        fontWeight={550}
        variant={"body1"}
        overflow={"hidden"}>{param.row.envVar.map((spec, index) => <Typography
        key={index}>{spec.key}: {spec.value}</Typography>)} </Typography>)
    },
    {
      field: "isEnabled",
      align: "left",
      headerName: "Status",
      width: 150,
      headerAlign: "left",
      sortable: false,
      filterable: false,
      renderCell: (param) => (
        <Tooltip arrow title={param.row.isEnabled ? "Enable" : "Disable"} placement="bottom-start">
          <Switch onChange={() => handleChangeStatus(param.row._id)}
                  checked={param.row.isEnabled}/>
        </Tooltip>
      )
    },
    {
      field: "action", headerName: "Actions", width: 150, sortable: false,
      filterable: false, renderCell: (param) => {
        return (<Box display={"flex"} gap={1}>
          <IconButton size={"small"} onClick={() => {
            setOpenUpdate(true)
            setSiteTemplateId(param.row._id)
          }}>
            <BorderColorIcon fontSize={"small"}/>
          </IconButton>
          <IconButton size={"small"} onClick={() => handleDeleteSiteTemplate(param.row._id)}>
            <DeleteOutlineOutlinedIcon color={"error"} fontSize={"small"}/>
          </IconButton>
        </Box>)
      }
    }
  ]

  const handleChangeStatus = (id: string) => {
    // TODO
    // const siteTemplateIndex = siteTemplates.findIndex(item => item._id === id)
    // if (siteTemplateIndex === -1) return;
    // const payload = {
    //   updateValues: {
    //     name: siteTemplates[siteTemplateIndex].name,
    //     dockerImage: siteTemplates[siteTemplateIndex].dockerImage,
    //     envVar: siteTemplates[siteTemplateIndex].envVar,
    //     status: false
    //   },
    //   id
    // }
    // dispatch(updateSiteTemplate(payload)).then((res: any) => {
    //   if (res.meta.requestStatus === "fulfilled") {
    //     enqueueSnackbar('ReportedPost template updated successfully', {
    //       variant: 'success',
    //     });
    //   } else {
    //     enqueueSnackbar('ReportedPost template updated failed', {
    //       variant: 'error',
    //     });
    //   }
    // })
  }

  const handleDeleteSiteTemplate = (id: string) => {
    confirm({
      title: "Are you sure?",
      description: "This action cannot be undone, are you sure you want to delete this site template."
    })
      .then(() => {
        dispatch(deleteSiteTemplate(id)).then((res: any) => {
          if (res.meta.requestStatus === "fulfilled") {
            enqueueSnackbar('ReportedPost template deleted successfully', {
              variant: 'success',
            });
          } else {
            enqueueSnackbar('ReportedPost template deleted failed', {
              variant: 'error',
            });
          }
        })
      })

  }

  return <>
    <BuffWrapper>
      <Box>
        <Paper sx={{p: "20px 30px"}}>
          <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Typography
              mb={2} variant={"body1"}
              sx={{
                fontSize: "20px",
                fontWeight: "bold"
              }}>Manage site template</Typography>
            <Button
              startIcon={<AddIcon/>}
              variant={"contained"} sx={{mb: 2}}
              onClick={() => setOpenAdd(true)}>Create</Button>
          </Box>
          {siteTemplates.length > 0 ? <StyledTable
            loading={loading}
            paginationMode={"server"}
            columns={column}
            rows={siteTemplates}
            initialState={{
              pagination: {
                paginationModel: {pageSize: pagination.limit, page: 0},
              },

            }}
            onPaginationModelChange={val => dispatch(loadProducts({
              page: +val.page + 1,
              limit: pagination.limit
            }))}
            rowCount={pagination.totalDocs}
            getRowId={row => row._id}
            rowHeight={80}
          /> : (!loading && <NoData/>)}
        </Paper>
      </Box>
    </BuffWrapper>
    <AddSiteTemplate openAdd={openAdd} setOpenAdd={setOpenAdd}/>
    <UpdateSiteTemplate id={siteTemplateId} openUpdate={openUpdate} setOpenUpdate={setOpenUpdate}/>
  </>
}

ManageSiteTemplate.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);
export default ManageSiteTemplate;