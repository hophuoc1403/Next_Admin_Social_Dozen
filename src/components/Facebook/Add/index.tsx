import {
  Box, Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {useMemo, useState} from "react";
import {MonetizationOnOutlined} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { GridColDef} from "@mui/x-data-grid";
import {useSnackbar} from "notistack";
import {useCart} from "@/hooks/useCart";
import {useAppDispatch} from "@/hooks/redux.hook";
import { onSetEmptySelectedEntity} from "@/redux/reducer/cart.slice";
import {tagService
} from "@/services/tags.service";
import {useRouter} from "next/router";
import {StyledTable} from "../../../../pages/app/cart";


const Add = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {selectedCart} = useCart()

  const total = useMemo(() => selectedCart.reduce((init, item) => item.quantity * item.productSite.price + init, 0), [selectedCart])

  const column: GridColDef<ICartItem>[] = [
    {
      field: "productSite",
      headerName: "Name",
      width: 200,
      headerAlign: "center",
      renderCell: (param) => (<Typography
        variant={"body1"} maxWidth={120}
        overflow={"hidden"}>{param.row.productSite.product.name}</Typography>), align: "center"
    },
    {
      field: "quantity", headerName: "Quantity", width: 200, renderCell: (params) => {
        return (<Box display={"flex"} alignItems={"center"} gap={1}>
          <Typography >{params.row.quantity}</Typography>
        </Box>)
      }, headerAlign: "center", align: "center"
    },{
      field: "total",
      headerName: "Total price",
      align: "center",
      width: 200,
      headerAlign: "center",
      renderCell: (param) => (<Typography
        variant={"body1"} maxWidth={120}
        overflow={"hidden"}
      >${param.row.productSite.price * param.row.quantity}</Typography>)
    },
  ]

  const {enqueueSnackbar} = useSnackbar()

  const createOrder = async () => {
    try {
      setIsLoading(true)
      const payloadCart = selectedCart.map(item => ({productSite: item.productSite._id, quantity: item.quantity}))
      await tagService
.createCustomerOrder({orderItems: payloadCart})
      enqueueSnackbar("Tags successfully!", {
        variant: 'success',
      });
      dispatch(onSetEmptySelectedEntity())
      router.push("/app/dashboards")
    } catch (error) {
      enqueueSnackbar(error.response.data.message, {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }


  return <Paper sx={{p: "20px 30px"}}>
    <Typography variant={"h4"}>Add new order</Typography>
    <Divider sx={{my: 2}}/>
    <Stack flexDirection={"column"} gap={2}>

      {selectedCart.length > 0 &&
          <StyledTable
          columns={column} rows={selectedCart}
          initialState={{
            pagination: {
              paginationModel: {pageSize: 5, page: 0},
            }
          }}
          disableRowSelectionOnClick={true}
          hideFooter
          getRowId={row => row.productSite._id}
      />}

      <Box mb={2}>
        <Typography variant={"body1"} fontWeight={600}>
          Note (Not required)
        </Typography>
        <TextField style={{backgroundColor: "transparent", width: "100%", marginTop: "10px"}} multiline minRows={5}/>
      </Box>

      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Stack flexDirection={"row"} height={50} borderRadius={"5px"} overflow={"hidden"} border={"1px solid green"}>
          <Stack
            flexDirection={"row"} justifyContent={"center"}
            alignItems={"center"} sx={{padding: "25px"}}
            bgcolor={"green"}>
            <MonetizationOnOutlined/>
          </Stack>
          <Stack flexDirection={"row"} justifyContent={"center"} alignItems={"center"} sx={{padding: "25px"}}>
            <Typography fontWeight={500}>Total: <strong>${new Intl.NumberFormat().format(total)}</strong></Typography>
          </Stack>
        </Stack>
      </Box>

      <Divider/>
      <Stack flexDirection={"row"} gap={2}>
        <Button variant={"outlined"} onClick={() => router.push("/app/cart")}>Back</Button>
        <LoadingButton
          loading={isLoading}
          variant={"contained"} onClick={createOrder}>Checkout
          <SendIcon
            sx={{ml: .4}}
            fontSize={"small"}/></LoadingButton>
      </Stack>
    </Stack>
  </Paper>
}

export default Add