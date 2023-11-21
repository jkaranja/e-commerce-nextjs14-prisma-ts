"use client";
import MUIPagination from "@/app/components/MUIPagination";
import {
  Box
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useRouter } from "next/navigation";
import React from "react";
import ProductItem from "./ProductItem";

type ProductsListProps = {
  products: any[];
  totalPages: number;
  page: number;
  handlePageChange: (arg: number) => void;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
};

const ProductsList = ({
  products,
  totalPages,
  page,
  handlePageChange,
  itemsPerPage,
  setItemsPerPage,
}: ProductsListProps) => {
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
      <Box py={4}>
        <MUIPagination
          count={totalPages}
          page={page}
          //redirect="/listings?page" //when using render item
          changePage={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </Box>
    </Box>
  );
};

export default ProductsList;
