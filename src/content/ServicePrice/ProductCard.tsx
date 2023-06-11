import {
  Button,
  Card,
  CardContent,
  Popover,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, {useState} from "react";
import {makeStyles} from "@material-ui/styles";
import {Box} from "@mui/system";
import {useSnackbar} from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";
import {useRouter} from "next/router";
import {useAppDispatch} from "@/hooks/redux.hook";
import {onSelectEntities} from "@/redux/reducer/cart.slice";
import {updateCartItem} from "@/redux/actions/cart.action";
import {ThemeConstant} from "@/constants/theme.constant";
import {useTheme as useReduxTheme} from "@/hooks/useTheme";
import {CART_ACTION} from "@/constants/redux.contstant";

const useStyles = makeStyles({
  cardWrapper: {
    paddingTop: "30px",
    padding: "0 12px",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // width: "25%",
    borderRadius: 8,
    transition: 'transform 0.2s',
    marginTop: 35,
    position: "relative",
    overflow: "unset",
    height: "auto",
    '&:hover': {
      transform: 'translateY(-4px) scale(1.01) ',
    },
  },
  card: {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding:"10px 5px",
    cursor: "pointer",
    height: "100%",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",

  },
  content: {
    flexGrow: 1,
  },
  title: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: 1.2,
    marginBottom: 16,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2, /* number of lines to show */
    WebkitBoxOrient: "vertical",
  },
  description: {
    lineHeight: 1.4,
    marginBottom: 14,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2, /* number of lines to show */
    WebkitBoxOrient: "vertical",
  },
  featureName: {
    lineHeight: 1.2,
    marginBottom: 4,
    marginTop: 5,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2, /* number of lines to show */
    WebkitBoxOrient: "vertical",
  },
  price: {
    // marginTop: 10,
    textAlign: 'right',
  },
  priceTop: {
    position: "absolute",
    top: "10px",
    right: "30px",
    overflow: "auto",
    padding: "5px 10px",
    backgroundColor: "#171d37",
    borderRadius: "3px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },
});


const ProductCard: React.FC<{ productSite: IProductSite, setSelectedProduct: () => void }> = (
  {
    productSite,
    setSelectedProduct
  }) => {
  const {product, _id, price} = productSite
  const classes = useStyles();
  const [amountVal, setAmountVal] = useState(1)
  const [cartRef, setCartRef] = useState<HTMLButtonElement | null>(null)
  const {enqueueSnackbar} = useSnackbar()
  const [isUpdatingCart, setIsUpdatingCart] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {theme : reduxTheme} = useReduxTheme()
  const theme = useTheme()

  const handleUpdateCart = async () => {
    try {
      setIsUpdatingCart(true)
      await dispatch(updateCartItem({productSite: _id, quantity: amountVal, action: CART_ACTION.INCREASE}))
      enqueueSnackbar("Add to cart successfully!", {
        variant: 'success',
      });
      setCartRef(null)
    } catch (error) {
      enqueueSnackbar("Add to cart failed!", {
        variant: 'error',
      });
    } finally {
      setIsUpdatingCart(false)
    }
  }

  const handleOrder = async () => {
    await dispatch(updateCartItem({productSite: _id, quantity: 1, action: CART_ACTION.INCREASE}))
    dispatch(onSelectEntities({cartItem: [{productSite, quantity: 1}]}))
    router.push('/app/cart')
  }

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box className={classes.cardWrapper} sx={{width:isMobile ? "100%" : (isTablet ? "50%" : "25%")}}>
      <Card onClick={setSelectedProduct} className={classes.card} >
        <Box className={classes.priceTop} style={{
          backgroundColor: reduxTheme === ThemeConstant.LIGHT ? "#351c75" : "#eeeeee",
          color: reduxTheme === ThemeConstant.LIGHT ? "#fff" : "#000"
        }}>
          <Typography fontWeight={500} variant="body2" component="div">
            $ {new Intl.NumberFormat().format(price)}
          </Typography>
        </Box>
        <CardContent className={classes.content}>
          <Typography variant="h6" component="div" className={classes.title}>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" className={classes.description}>
            {product.description}
          </Typography>
          <Typography variant="h5" mb={1} component="div">
            Features:
          </Typography>
          {product.specs.map((feature, index) => (
            <>
              {index < 2 && <Stack key={index} flexDirection={"row"} alignItems={"center"} gap={1}>
                  <Typography
                      fontWeight={600} variant="body2"
                      color="text.secondary" key={index}
                      className={classes.featureName}>
                    {feature.k}:
                  </Typography>
                  <Typography
                      fontWeight={500} variant="body2"
                      color="text.secondary"
                      className={classes.featureName}>{feature.v}</Typography>
              </Stack>}
            </>
          ))}
        </CardContent>
        <CardContent className={classes.price}>
          <Stack flexDirection={"column"} justifyContent={"flex-end"}>
            <Stack flexDirection={"row"} justifyContent={"flex-end"} gap={1}>
              <Button variant={"contained"} size={"small"} onClick={handleOrder}>
                Order
              </Button>
                <Button variant={"outlined"} size={"small"}
                        onClick={e => {
                          e.stopPropagation()
                          setCartRef(e.currentTarget)
                        }}>
                  {/*<AddShoppingCartIcon fontSize={"small"}/>*/}
                  Add to cart
                </Button>
            </Stack>
          </Stack>
        </CardContent>
        <Popover
          open={!!cartRef}
          anchorEl={cartRef}
          onClose={() => setCartRef(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClick={e => e.stopPropagation()}
        >
          <Box p={2} display={"flex"} gap={1}>
            <TextField
              label={"Amount"} size={"small"}
              type={"number"} inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
              onChange={(e) => {
                if (+e.target.value >= 0 && +e.target.value < 1000)
                  setAmountVal(+e.target.value)
              }
              }
              value={amountVal}
            />
            <LoadingButton
              loading={isUpdatingCart} variant={"contained"}
              size={"small"}
              onClick={() => {
                handleUpdateCart()
              }}>Add</LoadingButton>
          </Box>
        </Popover>
      </Card>
    </Box>
  );
};

export default ProductCard;