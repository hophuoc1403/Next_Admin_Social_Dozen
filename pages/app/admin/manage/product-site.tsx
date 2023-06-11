import SidebarLayout from "@/layouts/SidebarLayout";
import {
  Autocomplete, Backdrop,
  Box,
  Button, CircularProgress, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper, Popover,
  TextField, Tooltip,
  Typography
} from "@mui/material";
import {useProductSites} from "@/hooks/useProductSites";
import ManageProductSiteWrapper from "@/components/wrapper/ManageProductSiteWrapper";
import {GridColDef} from "@mui/x-data-grid";
import {StyledTable} from "../../cart";
import React, {useEffect, useState} from "react";
import {useProducts} from "@/hooks/useProducts";
import VisibleDialog from "@/components/VisibleDialog";
import {useSites} from "@/hooks/useSites";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSnackbar} from "notistack";
import {useAppDispatch} from "@/hooks/redux.hook";
import {createProductSite, loadProductSites, updateProductSite} from "@/redux/actions/product-sites.action";
import LoadingButton from "@mui/lab/LoadingButton";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import NoData from "@/content/shared/NoData";
import AddIcon from '@mui/icons-material/Add';

const createFormSchema = z.object({
  site: z.string().min(1, "ReportedPost is required!"),
  product: z.string().min(1, "Product is required!"),
  price: z.string().min(1, "Price must be positive number!")
});

const ManageProductSite = () => {
  const [priceRef, setPriceRef] = useState<HTMLDivElement | null>(null)
  const dispatch = useAppDispatch();
  const {productSites, loading, pagination} = useProductSites();
  const {sites} = useSites();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
  const {products} = useProducts();
  const {enqueueSnackbar} = useSnackbar();
  const [updatePriceValue, setUpdatePriceValue] = useState<number>(0);
  const [currentRowID, setCurrentRowID] = useState<string | null>(null);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState<boolean>(false);
  const handleRemoveSelectedCartItem = async () => {
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
  });

  const column: GridColDef<IProductSite>[] = [
    {
      flex: 1,
      field: "Product name",
      headerName: "Product name",
      sortable: false,
      filterable: false,
      resizable: true,
      renderCell: (param) => (<Typography
        fontWeight={550}
        variant={"body1"}
      >
        {param.row.product.name}
      </Typography>)
    },
    {
      flex: 1,
      field: "Description",
      headerName: "Description",
      sortable: false,
      filterable: false,
      resizable: true,
      renderCell: (param) => (<Typography
        fontWeight={550}
        variant={"body1"}
      >
        {param.row.product.description}
      </Typography>)
    },
    {
      width: 160,
      field: "ReportedPost name",
      headerName: "ReportedPost name",
      sortable: false,
      filterable: false,
      resizable: true,
      renderCell: (param) => (<Typography
        fontWeight={550}
        variant={"body1"}
      >
        {param.row.site.siteName}
      </Typography>)
    },
    {
      width: 120,
      field: "Owner",
      headerName: "Owner",
      sortable: false,
      filterable: false,
      resizable: true,
      renderCell: (param) => (<Typography
        fontWeight={550}
        variant={"body1"}
      >
        {param.row.site.owner.username}
      </Typography>)
    },
    {
      width: 120,
      field: "Price",
      renderHeader: (_params) => {
        return <>Price
          <BorderColorIcon sx={{fontSize: 16, marginLeft: '6px'}}/>
        </>
      },
      sortable: false,
      filterable: false,
      resizable: true,
      renderCell: (param) => (
        <Box onClick={(e) => {
          setCurrentRowID(param.row._id)
          setPriceRef(e.currentTarget)
          setUpdatePriceValue(param.row.price)
        }}
             sx={{cursor:"pointer"}}
        >
         <Tooltip title={"Click to update price"}>
           <Typography
             fontWeight={550}
             variant={"body1"}
           >
             {param.row.price}
           </Typography>
         </Tooltip>
        </Box>
      )
    },
  ]

  useEffect(() => {
    dispatch(loadProductSites({}))
  }, [])

  const onCancelCreate = () => {
    setIsOpenCreate(false);
  }

  const onCreate = handleSubmit(async (payload) => {
    const {product, price, site} = payload;
    dispatch(createProductSite({product, price: +price, site})).then((result) => {
      enqueueSnackbar("Create product site successfully!", {variant: "success"})
    }).catch((error) => {
    }).finally(() => {
      reset();
      setIsOpenCreate(false);
    });
  })


  return <ManageProductSiteWrapper>
    <Box>
      <Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={loading}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>
      <Box>
        <Paper sx={{p: "20px 30px"}}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography
              mb={2} variant={"body1"}
              sx={{
                fontSize: "20px",
                fontWeight: "bold"
              }}>Manage product sites</Typography>
            <Button
              startIcon={<AddIcon/>} variant={"contained"}
              sx={{mb: 2}}
              onClick={() => {
                setIsOpenCreate(true)
              }}>Create</Button>
          </Box>
          {productSites.length > 0 ?
            <StyledTable
              columns={column}
              rows={productSites}
              initialState={{
                pagination: {
                  paginationModel: {pageSize: pagination.limit, page: 0},
                },
              }}
              onPaginationModelChange={val => dispatch(loadProductSites({
                page: +val.page + 1,
                limit: pagination.limit
              }))}
              rowCount={pagination.totalDocs}
              getRowId={row => row._id}
              paginationMode={"server"}
              disableRowSelectionOnClick
              // sx={{}}
            />
            : (!loading && <NoData/>)
          }
          <Box display={"flex"} flexDirection={"column"} alignItems={"flex-end"} mt={4} gap={2}>
            <Typography style={{display: "inline-block", fontSize: 18}}>
            </Typography>
            <Box>
            </Box>
          </Box>
        </Paper>

      </Box>
    </Box>
    <VisibleDialog
      open={isOpenCreate} title={"Create"}
      onClose={onCancelCreate} onCancel={onCancelCreate}
      textEnter={"Create"} onEnter={onCreate}>
      <form onSubmit={onCreate}>
        <Autocomplete
          sx={{marginBottom: 2}}
          disablePortal
          id="combo-box-demo2"
          options={sites.map((site) => {
            return {...site, label: site.siteName}
          })}
          fullWidth
          renderInput={(params) =>
            <TextField
              {...params}
              label="ReportedPost"
              id="siteField"
              error={!!errors.site}
              helperText={errors.site?.message}
              {...register('site')}

            />}
        />
        <Autocomplete
          sx={{marginBottom: 2}}
          disablePortal
          id="combo-box-demo1"
          options={products.map((product) => {
            return {name: product.name, label: product._id}
          })}
          fullWidth
          renderOption={(props, option) => {
            return <Box {...props} component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}}>{option.name}</Box>
          }}
          renderInput={(params) => <TextField {...params} label="Product"
                                              id="productField"
                                              error={!!errors.product}
                                              helperText={errors.product?.message}
                                              {...register('product')}
          />}
        />
        <TextField
          type="number"
          id="priceField"
          label="Price"
          inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
          error={!!errors.price}
          helperText={errors.price?.message}
          {...register('price')}
          fullWidth
        />
      </form>
    </VisibleDialog>
    <Dialog
      open={isOpenModalDelete}
      keepMounted
      onClose={() => setIsOpenModalDelete(false)}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Do you want to delete this item ? "}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpenModalDelete(false)}>Disagree</Button>
        <Button onClick={() => handleRemoveSelectedCartItem()}>Agree</Button>
      </DialogActions>
    </Dialog>
    <Popover
      open={!!priceRef}
      anchorEl={priceRef}
      onClose={() => setPriceRef(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box p={2} display={"flex"} gap={1}>
        <TextField
          label={"Price"} size={"small"}
          type={"number"} inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
          onChange={(e) => {
            setUpdatePriceValue(+e.target.value)
          }
          }
          value={updatePriceValue}
        />
        <LoadingButton
          loading={isUpdatingPrice} variant={"contained"}
          size={"small"}
          onClick={() => {
            setIsUpdatingPrice(true);
            dispatch(updateProductSite({
              id: currentRowID,
              price: updatePriceValue
            })).then(() => {
              enqueueSnackbar("Update price successfully!", {variant: 'success'})
            }).catch(() => {
              enqueueSnackbar("Failed to update price!", {variant: 'error'})
            }).finally(() => {
              setIsUpdatingPrice(false);
              setPriceRef(null)
            })
          }}>Update
        </LoadingButton>
      </Box>
    </Popover>
  </ManageProductSiteWrapper>
}

ManageProductSite.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);
export default ManageProductSite;