import {Box, Paper, Typography} from "@mui/material";
import {NextPageWithLayout} from "../../../_app";
import SidebarLayout from "@/layouts/SidebarLayout";
import {GridColDef} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {useAppDispatch} from "@/hooks/redux.hook";
import {useSites} from "@/hooks/useSites";
import BuffWrapper from "@/components/wrapper/BuffWrapper";
import {StyledTable} from "../../cart";
import IconButton from "@mui/material/IconButton";
import {useConfirm} from "material-ui-confirm";
import {useSnackbar} from "notistack";
import SiteEditModal from "@/components/Manage/SiteEditModal";

import BorderColorIcon from '@mui/icons-material/BorderColor';
import NoData from "@/content/shared/NoData";
import {DeleteOutline} from "@mui/icons-material";
import {loadPost} from "@/redux/actions/site.action";
import {siteService} from "@/services/reportedPost.service";

const ReportedPost: NextPageWithLayout = () => {

  const {sites, loading, pagination} = useSites()
  const dispatch = useAppDispatch()
  const confirm = useConfirm();
  const {enqueueSnackbar} = useSnackbar();
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false)

  useEffect(() => {
    dispatch(loadPost({}))
  }, [])

  const handleDeleteSite = async (id: number) => {
    confirm({description: "This action is permanent!"}).then(async () => {
      await siteService.deletePost(id)
      enqueueSnackbar("delete success",{
        variant:"success"
      })
      dispatch(loadPost({}))

    }).catch(r => r)
  }

  const column: GridColDef<any>[] = [
    {
      field: 'title',
      align: 'left',
      // width: 200,
      flex: 1,
      headerAlign: 'left',
      headerName: 'Title',
      renderCell:(params) => (
        <>
        <Typography >{params.row.description}</Typography>
        </>
      )
    },

    {
      field: 'description',
      align: 'left',
      flex: 1,
      width: 250,
      headerAlign: 'left',
      headerName: 'Description'
    },
    {
      field: 'user',
      align: 'left',
      headerAlign: 'left',
      // width: 250,
      flex: 1,
      headerName: 'User',
      renderCell:(params) => (<Typography>{params.row.user.firstName}</Typography>)
    },
    {
      field: 'createdAt',
      align: 'left',
      headerAlign: 'left',
      // width: 250,
      flex: 1,
      headerName: 'Date',
      renderCell:(params) => (<Typography>{params.row.createdAt}</Typography>)

    },
    {
      field: "filter", headerName: "Actions", width: 170, renderCell: (params) => {
        return (<Box display={"flex"} gap={1}>
          <IconButton onClick={() => {
            setIsOpenModalEdit(true)
          }}> <BorderColorIcon fontSize={"small"}/></IconButton>
          <IconButton
            color={"error"}
            size={"small"}
            onClick={() => handleDeleteSite(params.row.post.id)}><DeleteOutline/></IconButton>
        </Box>)
      }, align: 'left',
      headerAlign: 'left',
    }
  ]

  return <BuffWrapper>
    <Paper sx={{p: "20px 30px"}}>
      <Typography
        mb={2} variant={"body1"}
        sx={{
          fontSize: "20px",
          fontWeight: "bold"
        }}>Manage Reported Post</Typography>
      {(sites.length > 0 ? <StyledTable
          columns={column}
          rows={sites}
          initialState={{
            pagination: {
              paginationModel: {pageSize: pagination.itemsPerPage, page: 0},
            },
          }}
          onPaginationModelChange={val => dispatch(loadPost({page: val.page + 1, limit: pagination.itemsPerPage}))}
          rowCount={pagination.totalItems}
          getRowId={row => row.id}
          disableRowSelectionOnClick
          paginationMode={"server"}
          loading={loading}
        />
        : (!loading && <NoData/>))}

    </Paper>

  </BuffWrapper>
}

ReportedPost.getLayout = page => <SidebarLayout>{page}</SidebarLayout>
export default ReportedPost