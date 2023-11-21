"use client";
import {
  Box
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useRouter } from "next/navigation";
import ProductItem from "./ProductItem";

type ProductsListProps = {
  products: any[];
};

const ProductsList = ({ products }: ProductsListProps) => {
  const router = useRouter();

  return (
    <Box>
      <Grid2 container spacing={1.5} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
        {products.map((product) => (
          <Grid2 key={product.id} xs={4} xl={3}>
            <ProductItem product={product} />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default ProductsList;
