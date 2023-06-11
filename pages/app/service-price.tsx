import {
  Backdrop,
  Box,
  CircularProgress,
  Pagination,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {NextPageWithLayout} from "../_app";
import SidebarLayout from "@/layouts/SidebarLayout";
import {useEffect, useState} from "react";
import ProductCard from "@/content/ServicePrice/ProductCard";
import {SearchOutlined} from "@mui/icons-material";
import {useDebounce} from "usehooks-ts";
import {useProductSites} from "@/hooks/useProductSites";
import {useAppDispatch} from "@/hooks/redux.hook";
import {loadProductSites} from "@/redux/actions/product-sites.action";
import AppDialog from "@/components/AppDialog";
import ProductDetail from "@/content/ServicePrice/ProductDetail";
import {useRouter} from "next/router";
import NoData from "@/content/shared/NoData";

const ServicePrice: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const {productSites, loading, pagination} = useProductSites();
  const [isSearching, setIsSearching] = useState(false)
  const [searchingVal, setSearchingVal] = useState('')
  const debouncedValue = useDebounce<string>(searchingVal, 1000)
  const [selectedProduct, setSelectedProduct] = useState<IProductSite | null>(null)
  const router = useRouter()
  const querySearch = router.query.q
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const handleGetProductSite = async (productName?: string) => {
    dispatch(loadProductSites({productName}))
  }

  useEffect(() => {
    if (querySearch) {
      setSearchingVal(querySearch as string)
    }
  }, [querySearch])

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    debouncedValue !== "" ? router.query.q = debouncedValue : delete router.query.q
    router.push(router).then(_ => {
      setIsSearching(false)
      handleGetProductSite(debouncedValue)
    })
  }, [debouncedValue])


  return (
    <Box width={"100%"} px={"40px"} mt={4} mb={2}>
      <Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={loading}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>
      <Stack alignItems={"center"} flexDirection={"row"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Typography variant={"h3"} textAlign={"center"}>List Services</Typography>
        <Box>
          <TextField
            value={searchingVal}
            onChange={e => {
              setSearchingVal(e.target.value)
              setIsSearching(true)
            }}
            label={"Search something ..."}
            InputProps={{
              endAdornment: <Box sx={{width: "30px"}}>{isSearching ? <CircularProgress size={20}/> :
                <SearchOutlined fontSize={"small"}/>}
              </Box>
            }}
            sx={{mb: 1}}
            size={"small"}
          />
          {debouncedValue !== '' &&
              <Typography variant={"body1"}>Search value for <strong>{debouncedValue}</strong></Typography>}
        </Box>
      </Stack>
      <Backdrop
        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={loading}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>
      <Stack
        flexDirection={"row"} justifyContent={!isTablet ? "flex-start" : "center"}
        sx={{margin: "0 -12px"}}
        width={"100%"}
        flexWrap={"wrap"}>
        {productSites.length > 0 && productSites.map(product => (
          <ProductCard key={product._id} productSite={product} setSelectedProduct={() => setSelectedProduct(product)}/>
        ))}
        {debouncedValue && productSites.length === 0 && <NoData/>}
      </Stack>
      {productSites.length > 0 && <Stack my={3} flexDirection={"row"} justifyContent={"center"}>
          <Pagination
              count={pagination.totalPages}
              onChange={(e, val) => dispatch(loadProductSites({page: val, limit: pagination.limit}))}/>
      </Stack>}
      {selectedProduct &&
          <AppDialog open={!!selectedProduct} title={"Product detail"} onClose={() => setSelectedProduct(null)}>
              <ProductDetail productSite={selectedProduct}/>
          </AppDialog>}
    </Box>)
}

ServicePrice.getLayout = page => <SidebarLayout>{page}</SidebarLayout>

export default ServicePrice