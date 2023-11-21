"use client";
import MUIPagination from "@/app/components/MUIPagination";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Product } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { getProducts } from "./actions/getProducts";

import ProductItem from "./ProductItem";

const Products = () => {
  //seTransition is a React Hook that lets you update the state without blocking the UI.
  //can also use it to invoke Server Actions in next 13
  //startTransition does not return anything
  const [isPending, startTransition] = useTransition();
  //dialogs
  const [openAddD, setOpenAddD] = useState(false);
  const [openEditD, setOpenEditD] = useState(false);
  const handleToggleAddD = () => setOpenAddD((prev) => !prev);
  const handleToggleEditD = () => setOpenEditD((prev) => !prev); 

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [records, setRecords] = useState(0); //total products/records
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getProducts({ page, itemsPerPage });
        setProductsList(data?.products || []);
        setTotalPages(data?.pages || 0);
        setRecords(data?.total || 0);
      } catch (error: any) {
        //toast.info(error.message as string);
      }
    });
  }, [page, itemsPerPage]);

  /* ----------------------------------------
   HANDLE PAGINATION
   ----------------------------------------*/
  //for custom pagination & mui onchange
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <TableContainer component={Paper}>
      {openAddD && (
        <AddProduct open={openAddD} handleClose={handleToggleAddD} />
      )}
      {openEditD && (
        <EditProduct open={openEditD} handleClose={handleToggleEditD} />
      )}

      <Box textAlign="right" py={4} px={3}>
        <Button variant="outlined" onClick={handleToggleAddD}>
          Add new
        </Button>
      </Box>

      <Box py={2} px={3}>
        {isPending ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Typography color="muted.main">
            {!!records && `${records} results`}
          </Typography>
        )}
      </Box>

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Product</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Price(Ksh)</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Sold</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productsList.map((product) => (
            <ProductItem product={product} key={product.id} />
          ))}
        </TableBody>
      </Table>

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
    </TableContainer>
  );
};
export default Products;
