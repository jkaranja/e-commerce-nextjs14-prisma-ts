"use client";

import {
  Box
} from "@mui/material";
import { Product } from "@prisma/client";

type RelatedProductsProps = {
  product: Product;
};

const RelatedProducts = ({ product }: RelatedProductsProps) => {
  return <Box py={6}>RelatedProducts</Box>;
};

export default RelatedProducts;
