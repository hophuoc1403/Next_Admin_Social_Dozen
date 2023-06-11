import {Button, Card, CardContent, Popover, Stack, TextField, Tooltip, Typography} from '@mui/material';
import React, {useState} from "react";
import {makeStyles} from "@material-ui/styles";
import {Box} from "@mui/system";
import {useSnackbar} from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";
import {useRouter} from "next/router";
import {useAppDispatch} from "@/hooks/redux.hook";
import {onSelectEntities} from "@/redux/reducer/cart.slice";
import {updateCartItem} from "@/redux/actions/cart.action";
import {CART_ACTION} from "@/constants/redux.contstant";

const useStyles = makeStyles({
  card: {
    overflow: "unset",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: -20,
    position: "relative",
    flex: 1,
    minWidth: "280px !important",
    border:"1px solid transparent !important",
    boxShadow:"unset"
  },
  content: {
    flexGrow: 1,
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: 1.2,
    marginBottom: 16,
  },
  description: {
    fontSize: "15px",
    lineHeight: 1.4,
    marginBottom: 14,
  },
  featureName: {
    lineHeight: 1.2,
    marginBottom: 4,
    marginTop: 5
  },
  price: {
    textAlign: 'right',
  },
  priceTop: {
    position: "absolute",
    top: "-10px",
    right: "20px",
    overflow: "auto",
    padding: "5px 10px",
    backgroundColor: "#171d37",
    borderRadius: "3px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  }
});


const ProductDetail: React.FC<{ productSite: IProductSite}> = (
  {
    productSite,
  }) => {
  const {product, _id, price} = productSite
  const classes = useStyles();
  const [amountVal, setAmountVal] = useState(1)
  const [cartRef, setCartRef] = useState<HTMLButtonElement | null>(null)
  const {enqueueSnackbar} = useSnackbar()
  const [isUpdatingCart, setIsUpdatingCart] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

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

  return (
    <Card className={classes.card}  sx={{borderRadius:"unset",display:"none"}}>
      <CardContent className={classes.content}>
        <Typography variant="h6" component="div" className={classes.title}>
          {product.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" className={classes.description}>
          {product.description}
        </Typography>
        <Typography variant="h4" mb={1} component="div">
          Price : {new Intl.NumberFormat().format(price)}
        </Typography>
        <Typography variant="h4" mb={1} component="div">
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
        <Stack flexDirection={"row"} justifyContent={"flex-end"} gap={1}>
          <Button variant={"contained"} size={"small"} onClick={handleOrder}>
            Order
          </Button>
          <Tooltip title={"Add to your cart"}>
            <Button variant={"outlined"} size={"small"}
                    onClick={e => {
                      e.stopPropagation()
                      setCartRef(e.currentTarget)
                    }}>
              {/*<AddShoppingCartIcon fontSize={"small"}/>*/}
              Add to cart
            </Button>
          </Tooltip>
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
  );
};

export default ProductDetail;