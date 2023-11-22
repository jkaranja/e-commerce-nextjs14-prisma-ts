"use client";
import { Suspense, useState, useTransition } from "react";

import { Box, Button, CircularProgress, Typography } from "@mui/material";

import { useContextValue } from "@/app/hooks/useContextValue";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { placeOrder } from "../actions/actions";
import Information from "./Information";
import Payment from "./Payment";
import Shipping from "./Shipping";

type StepperProps = {
  //
};

const Stepper = ({}: StepperProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    state: { cart, order },
    dispatch,
  } = useContextValue();

  const steps = [
    { step: "Information", content: <Information /> },
    { step: "Shipping", content: <Shipping /> },
    { step: "Payment", content: <Payment /> },
  ];

  const maxSteps = steps.length;

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleNext = () => setActiveStep((prev) => prev + 1);

  //place order
  const handlePlaceOrder = async () => {
    try {
      const result = await placeOrder(order);
      toast.success("Order placed");

      //clear cart and order->then go to orders
      dispatch({ type: "RESET_CART" });

      //redirect(`/account/orders`);//don't use redirect//Know bug/error: NEXT_REDIRECT
      router.push("/account/orders");
    } catch (error: any) {
      toast.error(error.message as string);
      return; //to terminate the transition state
    }
  };

  //prevent loading any content if navigating to checkout if no order in state
  //This will cause error since order is null hence order.items = typeError if no optional chaining used
  //shouldn't accessing this page anyway if no orders
  if (!order?.items) return;

  return (
    <Box>
      <Box>
        <Box display="flex" mb={2}>
          {steps.map((item, i) => (
            <Box key={item.step + i} display="flex">
              <Typography
                key={item.step + i}
                variant="body2"
                color={activeStep === i ? "primary.main" : "secondary.main"}
                onClick={() => setActiveStep(i)}
                sx={{ cursor: "pointer" }}
              >
                {item.step}
              </Typography>

              <Typography variant="body2" component="span" px={0.5}>
                {i !== maxSteps - 1 && ` / `}
              </Typography>
            </Box>
          ))}
        </Box>

        <Suspense
          fallback={
            <Box>
              <Typography>Loading...</Typography>
            </Box>
          }
        >
          {steps[activeStep].content}
        </Suspense>
      </Box>

      <Box display="flex" justifyContent="space-between" py={3}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>

        {activeStep === maxSteps - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => startTransition(handlePlaceOrder)}
            disabled={isPending}
            endIcon={
              isPending && <CircularProgress size={20} color="inherit" />
            }
          >
            Place order
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Continue to {steps[activeStep + 1].step}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Stepper;
