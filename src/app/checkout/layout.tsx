"use client";
import {
  Divider
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import OrderSummary from "./components/OrderSummary";

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  //if you access /checkout manually, will be errors if order is null since we don't have optional chaining when access eg order.items//user shouldn't access this page with no orders anyway
  //redirecting below is not good as we want to redirect user to account after placing order.
  //when order is cleared from state, this will redirect to home before the redirect to account could run
  //find a diff way  eg using if (!order?.items) return //in other component using order //stepper and order summary
  // const {
  //   state: { cart, order },
  //   dispatch,
  // } = useContextValue();

  // if (!order?.items) redirect("/"); // redirect to home if no order

  return (
    <Grid2
      container
      justifyContent="space-between" //xs below stretches/flex grow div vertically
      // alignItems="stretch" ///fill full width
      mb={4}
      minHeight="100vh"
    >
      <Grid2 xs flexGrow={2} px={6} py={4}>
        {children}
      </Grid2>

      <Grid2 xs="auto" px={3}>
        <Divider orientation="vertical" />
      </Grid2>

      <Grid2 xs flexGrow={1}>
        <OrderSummary />
      </Grid2>
    </Grid2>
  );
};

export default CheckoutLayout;
