"use client";

import {
  Box,
  Paper,
  Typography
} from "@mui/material";
import { Product } from "@prisma/client";

type DescriptionProps = {
  product: Product;
};

const Description = ({ product }: DescriptionProps) => {
  return (
    <Box component={Paper} py={10} p={3} mb={4}>
      <Typography paragraph>{product.description}</Typography>
    </Box>
  );
};

export default Description;
