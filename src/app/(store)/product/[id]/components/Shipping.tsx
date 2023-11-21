"use client";

import {
  Box,
  Typography
} from "@mui/material";
import { Product } from "@prisma/client";


type ShippingProps = {
  product: Product;
};

const Shipping = ({ product }: ShippingProps) => {
  return (
    <Box py={6}>
      <Typography>Shipping information at checkout</Typography>
    </Box>
  );
};

export default Shipping;
