import {Box} from "@mui/system";
import AppDialog from "@/components/AppDialog";
import {Divider, Typography} from "@mui/material";
import {GridColDef} from "@mui/x-data-grid";
import {StyledTable} from "../../../pages/app/cart";
import moment from "moment/moment";

interface OrderDetailModalProps {
  order: IOrder
  isOpen: boolean,
  onClose: () => void,
}

const column: GridColDef<{ productSite: IProductSite, quantity: number }>[] = [
  {
    field: 'product',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    headerName: 'Name',
    renderCell: (params) => (
      <Typography  sx={{width:"140px",overflow:"hidden",textOverflow:"ellipsis"}} variant={"body1"}>{params.row.productSite.product.name}</Typography>
    )
  }, {
    field: 'price',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    headerName: 'Price',
    renderCell: (params) => (
      <Typography variant={"body1"}>${new Intl.NumberFormat().format(params.row.productSite.price)}</Typography>
    )
  }, {
    field: 'quantity',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    headerName: 'quantity',
  },
]

const OrderDetailModal = ({order, onClose, isOpen}: OrderDetailModalProps) => {
  const {account, site, orderItems, total, status, createdAt} = order
  return <AppDialog
    title="Tags details"
    open={isOpen}
    onClose={onClose}
    onCancel={onClose}
  >
    <Box mt={-4}>
      <Divider/>
      <Typography variant={"h5"} my={1}>Site name : {site.siteName}</Typography>
      <Typography variant={"h5"} my={1}>User : {account.username}</Typography>
      <Typography variant={"h5"} my={1}>Tags : {orderItems.length} item(s)</Typography>
      <Divider/>
      <StyledTable
        sx={{my:2}}
        columns={column}
        rows={orderItems}
        initialState={{
          pagination: {
            paginationModel: {pageSize: 100, page: 0},
          },
        }}
        rowCount={orderItems.length}
        getRowId={row => row.productSite._id}
        disableRowSelectionOnClick
        hideFooter
      />

        <Typography variant={"h5"} my={1}>Status : {status}</Typography>
        <Typography variant={"h5"} my={1}>Tags date : {moment(createdAt).format("YYYY-MM-DD")}</Typography>
        <Typography variant={"h5"} my={1}>Total : ${new Intl.NumberFormat().format(total)}</Typography>
    </Box>

  </AppDialog>
}

export default OrderDetailModal