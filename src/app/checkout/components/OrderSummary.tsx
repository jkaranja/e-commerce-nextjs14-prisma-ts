import { CircularProgress, Divider, FormGroup, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState, useTransition } from "react";

import { useContextValue } from "@/app/hooks/useContextValue";
import { IItem } from "@/app/types/cart";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getCoupon } from "../actions/actions";

//drawer
const drawerWidth = 450;

type OrderSummaryProps = {};

const OrderSummary = ({}: OrderSummaryProps) => {
  const [isPending, startTransition] = useTransition();

  const [itemList, setItemList] = useState<IItem[]>([]);

  const {
    state: { cart, order },
    dispatch,
  } = useContextValue();

  type CouponForm = {
    coupon: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<CouponForm>();

  //apply coupon discount
  const onSubmit = async (data: CouponForm) => {
    //get coupon discount
    try {
      const coupon = await getCoupon(data.coupon);

      //apply coupon if valid
      dispatch({
        type: "UPDATE_ORDER",
        payload: {
          total: order.total - coupon.discount,
          discount: coupon.discount, //save discount applied too
        },
      });
    } catch (error: any) {
      toast.error(error.message as string);
    }
  };

  useEffect(() => {
    setItemList(order.items);
  }, [order]);

  //prevent loading any content if navigating to checkout if no order in state
  //This will cause error since order is null hence order.items = typeError if no optional chaining used
  //shouldn't accessing this page anyway if no orders
  if (!order?.items) return;

  return (
    <Box minHeight="100vh" position="relative" p={3}>
      <Box maxHeight="67vh" overflow="auto">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6">Order summary</Typography>
          <Typography textAlign="right">Items {order.items.length}</Typography>
        </Box>
        <Box>
          {itemList.map((item) => (
            <Box key={item.id} mb={2}>
              <Box display="flex" columnGap={1} mb={1}>
                <Image
                  src={item.product.images?.[0]?.url}
                  alt={item.product.title}
                  width={100}
                  height={150}
                  style={{ objectFit: "cover" }}
                />

                <Box flexGrow={1} px={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.product.title}
                  </Typography>

                  <Typography variant="body1">Qty {item.units}</Typography>

                  <Typography textAlign="right">
                    Ksh {item.units * item.product.discountedPrice}
                  </Typography>
                </Box>
              </Box>

              <Divider />
            </Box>
          ))}
        </Box>
      </Box>

      <Box position="absolute" bottom={0} py={4} width="90%">
        <Box>
          <Box display="flex" alignItems="center" mb={3} columnGap={1}>
            <FormGroup sx={{ flexGrow: 1 }}>
              <TextField
                {...register("coupon", {
                  required: "Coupon is required",
                })}
                label="Discount code, gift card, or coupon"
                margin="dense"
                fullWidth
                size="small"
              />
              <Typography color="error.main" variant="caption">
                {errors.coupon?.message}
              </Typography>
            </FormGroup>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => startTransition(handleSubmit(onSubmit))}
              disabled={isPending}
              endIcon={
                isPending && <CircularProgress size={20} color="inherit" />
              }
            >
              Apply
            </Button>
          </Box>

          <Typography paragraph>
            Shipping:{" "}
            {order.shipping
              ? `Ksh ${order.shipping}`
              : "Calculated at shipping"}
          </Typography>

          <Typography paragraph variant="subtitle1">
            Subtotal: Ksh {order.subTotal}
          </Typography>

          <Divider />
          <Typography paragraph variant="h6" pt={2}>
            Total: Ksh {order.total}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderSummary;
