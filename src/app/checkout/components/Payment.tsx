"use client";
import React, { useEffect, useTransition } from "react";

import {
  Box,
  Typography
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import PhoneInput from "react-phone-input-2";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useContextValue } from "@/app/hooks/useContextValue";
import { PaymentMethod } from "@prisma/client";

const Payment = () => {
  const [method, setMethod] = React.useState<PaymentMethod>(
    PaymentMethod.ONDELIVERY
  );

  const [isPending, startTransition] = useTransition();

  const handleChange = (mtd: PaymentMethod) => setMethod(mtd);

  const {
    state: { cart, order },
    dispatch,
  } = useContextValue();

  type PaymentForm = {
    phoneNumber: string;
    //or credit card info
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
  } = useForm<PaymentForm>();

  const formValues = useWatch({ control });

  useEffect(() => {
    const details = formValues as PaymentForm;

    if (!details) return;

    dispatch({
      type: "UPDATE_ORDER",
      payload: {
        paymentInfo: {
          paymentMethod: method,
          ...details,
        },
      },
    });
  }, [formValues, method]);
   console.log(order);

  return (
    <Box>
      <Typography variant="h6" paragraph>
        Payment method
      </Typography>
      <Typography paragraph>
        All transactions are secure and encrypted.
      </Typography>

      <Accordion
        expanded={method === PaymentMethod.ONDELIVERY}
        onChange={() => handleChange(PaymentMethod.ONDELIVERY)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Pay on delivery</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Pay with cash, credit card, or M-pesa on delivery
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={method === PaymentMethod.MPESA}
        onChange={() => handleChange(PaymentMethod.MPESA)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>M-Pesa</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Enter your phone number below. After you click Pay Now, you will get
            a prompt on your phone to confirm payment.
          </Typography>

          <Controller
            name="phoneNumber"
            control={control}
            rules={
              {
                // validate: (value, formValues) =>
                //   PHONE_NUMBER_REGEX.test(value) ||
                //   "Invalid phone number. Format: +254xxxxxxxxx",
              }
            }
            render={({ field: { value, onChange, ...field } }) => (
              <PhoneInput
                country={"ke"}
                onlyCountries={["ke"]}
                // inputProps={{ required: true, autoFocus: true }} //	object	props to pass into the input eg  = {{ name: 'phone', required: true, autoFocus: true}}
                value={value} //input state value
                onChange={(phone) => onChange(`+${phone}`)} //onChange(value, country: { name, dialCode, countryCode (iso2) }, event, formattedValue)//value = phoneNumber without the '+'
                countryCodeEditable={false}
                inputStyle={{ height: 55, width: "100%" }}
                containerStyle={{ height: 55 }}
              />
            )}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={method === PaymentMethod.CARD}
        onChange={() => handleChange(PaymentMethod.CARD)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Credit card</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Credit card is not supported in your country yet.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Payment;
