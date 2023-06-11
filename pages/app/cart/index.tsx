import SidebarLayout from "@/layouts/SidebarLayout";
import {
  Box,
  Button,
  IconButton,
  Paper,
  styled,
  TextField,
  Typography
} from "@mui/material";
import BuffWrapper from "@/components/wrapper/BuffWrapper";
import {useCart} from "@/hooks/useCart";
import {useEffect, useMemo, useState} from "react";
import {loadCart, updateCartItem} from "@/redux/actions/cart.action";
import {useAppDispatch} from "@/hooks/redux.hook";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {onSelectEntities} from "@/redux/reducer/cart.slice";
import {useRouter} from "next/router";
import {CART_ACTION} from "@/constants/redux.contstant";
import {useConfirm} from "material-ui-confirm";
import {loadProducts} from "@/redux/actions/product.action";
import NoData from "@/content/shared/NoData";
import {DeleteOutline} from "@mui/icons-material";


export const StyledTable = styled(DataGrid)(({theme}) => ({
  "& .MuiDataGrid-row:hover": {
    backgroundColor: `transparent`
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeader:focus-within": {
    outline: "none",
  },

}));

const StyledTotalAmount = styled(Typography)(({theme}) => ({
  display: "inline-block",
  fontSize: 20,
  color: `${theme.palette.primary.main}`,
  fontWeight: 600

}));

const CartPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const confirm = useConfirm()
  const {allCarts, selectedCart, pagination, loading} = useCart()
  const [selectedRows, setSelectedRows] = useState(() => allCarts.filter((cart) => {
    if (selectedCart.find(cartSelect => cartSelect.productSite._id === cart.productSite._id)) {
      return cart
    }
  }));
  const [selectionModel, setSelectionModel] = useState<any>(() => {
      const first = allCarts.filter((cart) => {
        if (selectedCart.find(cartSelect => cartSelect.productSite._id === cart.productSite._id)) {
          return cart
        }
      })
      return first.map(cart => {
          return cart.productSite._id
        }
      ) as unknown as GridRowId[]
    }
  );

  useEffect(() => {
    dispatch(loadCart({}))
  }, [])

  const total = useMemo(() => {
    return selectedRows.reduce((init, item) => item.quantity * item.productSite.price + init, 0)
  }, [selectedRows])

  const onCheckout = () => {
    dispatch(onSelectEntities({
      cartItem: selectedRows,
    }))
    router.push("/app/orders/add")
  }

  const column: GridColDef<ICartItem>[] = [
    {
      field: "Name",
      align: "left",
      headerName: "Name",
      width: 200,
      headerAlign: "left",
      renderCell: (param) => (<Typography
        fontWeight={550}
        variant={"body1"} maxWidth={120}
        overflow={"hidden"}>{param.row.productSite.product.name}</Typography>)
    },
    {
      field: "quantity", headerName: "Quantity", width: 200, renderCell: (params) => {
        return (<Box display={"flex"} alignItems={"left"} gap={1}>
          <IconButton
            size={"small"}
            onClick={(e) => {
              e.stopPropagation()
              if (selectedRows.find(cart => cart.productSite._id === params.row.productSite._id)) {
                setSelectedRows(state => state.map(cart => {
                  if (cart.productSite._id === params.row.productSite._id) {
                    return {...cart, quantity: cart.quantity - 1}
                  }
                  return cart
                }))
              }
              dispatch(updateCartItem({
                productSite: params.row.productSite._id,
                quantity: 1,
                action: CART_ACTION.DECREASE
              }))
            }
            }><RemoveIcon
            sx={{fontSize: "15px"}}/></IconButton>
          <TextField
            size={"small"} sx={{width: "50px", textAlign: "left"}}
            type={"tel"}
            value={params.row.quantity}
            onClick={(e: any) => {
              e.stopPropagation()
            }}
            onChange={(e) => {
              if (selectedRows.find(cart => cart.productSite._id === params.row.productSite._id)) {
                setSelectedRows(state => state.map(cart => {
                  if (cart.productSite._id === params.row.productSite._id) {
                    return {...cart, quantity: +e.target.value}
                  }
                  return cart
                }))
              }
              dispatch(updateCartItem({
                productSite: params.row.productSite._id,
                quantity: +e.target.value,
                action: CART_ACTION.MODIFY
              }))
            }}
          ></TextField>
          <IconButton
            size={"small"}
            onClick={(e) => {
              e.stopPropagation()
              if (selectedRows.find(cart => cart.productSite._id === params.row.productSite._id)) {
                setSelectedRows(state => state.map(cart => {
                  if (cart.productSite._id === params.row.productSite._id) {
                    return {...cart, quantity: cart.quantity + 1}
                  }
                  return cart
                }))
              }
              dispatch(updateCartItem({
                productSite: params.row.productSite._id,
                quantity: 1,
                action: CART_ACTION.INCREASE
              }))
            }}><AddIcon
            sx={{fontSize: "15px"}}/></IconButton>
        </Box>)
      }, headerAlign: "left", align: "left"
    },
    {
      field: "price",
      headerName: "Price",
      align: "left",
      width: 200,
      headerAlign: "left",
      renderCell: (param) => (<Typography
        variant={"body1"} maxWidth={120}
        overflow={"hidden"}>${param.row.productSite.price}</Typography>)
    },
    {
      field: "total",
      headerName: "Total price",
      align: "left",
      width: 200,
      headerAlign: "left",
      renderCell: (param) => (<Typography
        variant={"body1"} maxWidth={120}
        overflow={"hidden"}
      >${param.row.productSite.price * param.row.quantity}</Typography>)
    },
    {
      field: "filter", align: "left", headerName: "Actions", width: 200, renderCell: (params) => {
        return (<Box>
          <Button
            variant={"text"} color={"error"}
            size={"small"}
            onClick={(e: any) => handleDeleteCartItem(e, params.row.productSite._id, params.row.quantity)}><DeleteOutline/></Button>
        </Box>)
      }
    }
  ]

  const handleDeleteCartItem = (e: any, productSite, quantity) => {
    e.stopPropagation()
    confirm({
      title: "Are you sure?",
      description: "This action cannot be undone, are you sure you want to delete this item."
    })
      .then(() => {
        dispatch(updateCartItem({
          productSite,
          quantity,
          action: CART_ACTION.REMOVE
        }))
      })
  }

  return (
    <BuffWrapper>
      <Box>
        <Typography
          mb={2} variant={"body1"}
          sx={{
            fontSize: "20px",
            fontWeight: "bold"
          }}>My shopping cart</Typography>
        <Box>
          <Paper sx={{p: "20px 30px"}}>
            {allCarts.length > 0 ? <StyledTable
              paginationMode={"server"}
              sx={{mb:1}}
              columns={column}
              rows={allCarts}
              checkboxSelection
              onRowSelectionModelChange={(e) => {
                setSelectionModel(e);
                const selectedIDs = new Set(e);
                const selectedRows = allCarts.filter((r) => selectedIDs.has(r.productSite._id));
                setSelectedRows(selectedRows);
              }}
              rowSelectionModel={selectionModel}
              initialState={{
                pagination: {
                  paginationModel: {pageSize: 1, page: 0},
                },
              }}
              onPaginationModelChange={val => dispatch(loadProducts({
                page: +val.page + 1,
                limit: pagination.limit
              }))}
              rowCount={pagination.totalDocs}
              getRowId={row => row.productSite._id}
              rowHeight={70}
              loading={loading}
              hideFooter
            /> : <NoData/>}
            <Typography  variant={"subtitle1"} fontStyle={"italic"}>* Select item to checkout</Typography>
            {allCarts.length > 0 &&
                <Box display={"flex"} flexDirection={"column"} alignItems={"flex-end"} mt={3} gap={2}>
                    <Typography style={{display: "inline-block", fontSize: 18}}>
                        Total Amount ({selectedRows.length} item) : <StyledTotalAmount>
                        ${total}
                    </StyledTotalAmount>
                    </Typography>
                    <Box>
                        <Button variant={"contained"} onClick={onCheckout} disabled={!selectedRows.length}>
                            Checkout
                        </Button>
                    </Box>
                </Box>}
          </Paper>

        </Box>
      </Box>
    </BuffWrapper>
  )
}

CartPage.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default CartPage