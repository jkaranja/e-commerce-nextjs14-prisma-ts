import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import {
  ButtonGroup,
  Divider
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";

import Drawer from "@mui/material/Drawer";

import { useContextValue } from "@/app/hooks/useContextValue";
import { IItem } from "@/app/types/cart";
import calculateDiscount from "@/app/utils/calculateDiscount";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthDrawer from "../auth/AuthDrawer";
import { Role } from "@prisma/client";

//drawer
const drawerWidth = 450;

type CartDrawerProps = {
  open: boolean;
  handleClose: () => void;
};

const CartDrawer = ({ handleClose, open }: CartDrawerProps) => {
  //Authentication
  const { data: session, status, update } = useSession();
    const isAuthorized =
      status === "authenticated" && session?.user?.roles?.includes(Role.BUYER);

  const [cartList, setCartList] = useState<IItem[]>([]);

  const router = useRouter();

  const [openAuthD, setOpenAuthD] = useState(false);
  const handleToggleAuthD = () => setOpenAuthD((prevState) => !prevState);

  const {
    state: { cart },
    dispatch,
  } = useContextValue();

  //cal sub total
  const subTotal = useMemo(() => {
    return cartList.reduce(
      (acc, item) => acc + item.product.discountedPrice * item.units,
      0
    );
  }, [cartList]);

  const handleUpdateQty = (item: IItem, count: number) => {
    //if decrement and current qty is 1, exit
    if (count < 1 && item.units === 1) return;

    dispatch({ type: "UPDATE_QTY", payload: { id: item.id, count } });
  };

  const handleRemoveFromCart = (id: string) => {
    //dispatch to cart
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  //on checkout update order state
  const handleCheckout = () => {
    //if user not logged in, open auth drawer
    if (!isAuthorized) return handleToggleAuthD();

    //update order state
    dispatch({
      type: "UPDATE_ORDER",
      payload: { items: cart, subTotal, total: subTotal },
    });

    //then redirect to check out
    router.push("/checkout");
  };

  useEffect(() => {
    setCartList(cart);
  }, [cart]);

  return (
    <Box>
      {openAuthD && (
        <AuthDrawer open={openAuthD} handleClose={handleToggleAuthD} />
      )}

      <Drawer
        anchor="right" //| left | "right"| "bottom" | "top"
        variant="temporary"
        open={open}
        onClose={handleClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        PaperProps={{
          sx: {
            //bgcolor: "secondary.dark",
            //color: "dull.main",
            px: 2,
          },
        }}
      >
        <Box maxHeight="80vh" overflow="auto">
          <Box display="flex" py={2} justifyContent="space-between">
            <Typography variant="h5">Your Cart</Typography>

            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {!cart.length && <Typography my={3}>Your cart is empty</Typography>}

          <Box>
            {cartList.map((item) => (
              <Box key={item.id} mb={2}>
                <Box display="flex" columnGap={1} mb={1}>
                  <Image
                    //src={item.images[0].url}
                    src="https://cdn.pixabay.com/photo/2023/05/06/01/33/t-shirt-7973394_640.jpg"
                    alt={item.product.title}
                    width={100}
                    height={150}
                    style={{ objectFit: "cover" }}
                  />

                  <Box flexGrow={1}>
                    <Typography variant="subtitle1">
                      {item.product.title}
                    </Typography>

                    <Typography variant="body1" color="primary">
                      Ksh {item.product.discountedPrice}
                    </Typography>
                    <Box display="flex" columnGap={2}>
                      <Typography
                        sx={{ textDecoration: "line-through" }}
                        paragraph
                      >
                        Ksh {item.product.price}
                      </Typography>

                      <Typography paragraph>
                        (
                        {calculateDiscount(
                          item.product.price,
                          item.product.discountedPrice
                        )}
                        % off)
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <ButtonGroup size="small" variant="outlined">
                        <Button onClick={() => handleUpdateQty(item, -1)}>
                          <RemoveOutlinedIcon />
                        </Button>
                        <Button>{item.units}</Button>
                        <Button onClick={() => handleUpdateQty(item, 1)}>
                          <AddOutlinedIcon />
                        </Button>
                      </ButtonGroup>

                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <DeleteOutlineOutlinedIcon color="error" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                <Divider />
              </Box>
            ))}
          </Box>
        </Box>

        <Box position="absolute" bottom={0} py={4} width="94%">
          <Box mb={3}>
            <Typography paragraph>Shipping: Calculated at checkout</Typography>

            <Typography paragraph variant="subtitle1">Subtotal: Ksh {subTotal}</Typography>
            <Divider />
          </Box>

          <Button
            fullWidth
            color="secondary"
            variant="contained"
            size="large"
            onClick={() => handleCheckout()}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CartDrawer;
