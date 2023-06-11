import {
  alpha,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {styled} from '@mui/material/styles';
import {useAppDispatch} from "@/hooks/redux.hook";
import {loadCart} from "@/redux/actions/cart.action";
import {useCart} from "@/hooks/useCart";

import {useRouter} from "next/router";

const CartBadge = styled(Badge)(
  ({theme}) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.info.main, 0.1)};
        color: ${theme.palette.info.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.info.main, 0.3)};
            content: "";
        }
    }
`
);

const StyledPrice = styled(Typography)(
  ({theme}) => `
    font-weight:600;
    color: ${theme.palette.primary.main};
    font-size: 14px;
`
);

const StyledName = styled(Typography)(
  ({theme}) => `
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    cursor: pointer;
      color:${alpha(theme.palette.text.primary, .8)};
     &:hover {
    color:${alpha(theme.palette.text.primary, 1.5)};
  }
`
);

const StyledListItem = styled(ListItem)(
  ({theme}) => `
   &:hover {
    color:${alpha(theme.palette.text.primary, 1.5)} !important;
  }
`
);

function HeaderCart() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const {allCarts} = useCart()
  const router = useRouter()

  useEffect(() => {
    dispatch(loadCart({}))
  }, [])

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  return (
    <>
      <Tooltip arrow title="Cart">
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <CartBadge
            badgeContent={allCarts.length}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <ShoppingCartOutlinedIcon/>
          </CartBadge>
        </IconButton>
      </Tooltip>

      <Popover
        PaperProps={{
          style: {
            maxWidth: '420px',
          }
        }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box
          sx={{p: 2}}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {allCarts.length > 0 ? <Typography variant="h5">Recently Added Products</Typography> :
            <Typography variant="h5">Your cart is empty</Typography>}
        </Box>
        <Divider/>
        <Box>
          <List style={{maxHeight: 280, minWidth: 378, overflowY: "auto"}} sx={{p: 1.5}}>
            {allCarts && allCarts.map(cart => (
              <StyledListItem
                key={cart.productSite._id}
                sx={{
                  p: 1, minWidth: 350, display: {xs: 'block', sm: 'flex'}
                }}
              >
                <Box width={"100%"} display={"flex"} alignItems={"flex-start"} gap={3}>
                  <Box
                    width={"100%"} display="flex"
                    justifyContent="space-between" flexDirection={"column"}
                    gap={"4px"}>
                    <StyledName sx={{fontWeight: 'bold'}}>
                      {cart.productSite.product.name}
                    </StyledName>
                    <Typography
                      component="p"
                      variant="body2"
                      color="text.secondary"
                    >
                      {' '}
                      Quantity: {cart.quantity}
                    </Typography>
                  </Box>
                  <StyledPrice variant="caption">
                    ${cart.productSite.price * cart.quantity}
                  </StyledPrice>
                </Box>
              </StyledListItem>
            ))}
          </List>
        </Box>
        <Box sx={{px: 2, pt: 0, pb: 2}} display={"flex"} justifyContent={"flex-end"}>
          {allCarts.length > 0 ?
            <Button
              size={"small"}
              variant={"contained"}
              onClick={() => router.push("/app/cart").then(_ => handleClose())}
            > View Cart
            </Button> :
            <Button
              variant={"contained"}
              size={"small"}
              onClick={() => router.push("/app/service-price").then(_ => handleClose())}
            >Go to store
            </Button>}
        </Box>
      </Popover>

    </>
  );
}

export default HeaderCart;
