"use client";
import MUIPagination from "@/app/components/MUIPagination";
import { Box, CircularProgress, Typography } from "@mui/material";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { useEffect, useState, useTransition } from "react";
import { OrderWithProducts, getOrders } from "./actions/getOrders";

import ProductItem from "./components/OrderItem";

const OrdersList = () => {
  const [isLoading, setIsLoading] = useState(false);
  //dialogs
  const [openAddD, setOpenAddD] = useState(false);
  const [openEditD, setOpenEditD] = useState(false);
  const handleToggleAddD = () => setOpenAddD((prev) => !prev);
  const handleToggleEditD = () => setOpenEditD((prev) => !prev);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [records, setRecords] = useState(0); //total products/records
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const [ordersList, setOrdersList] = useState<OrderWithProducts[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await getOrders({ page, itemsPerPage });
        setOrdersList(data?.orders || []);
        setTotalPages(data?.pages || 0);
        setRecords(data?.total || 0);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        //toast.info(error.message as string);
      }
    })();
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
      <Box py={2} px={3}>
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Typography color="muted.main">
            {!!records && `${records} results`}
          </Typography>
        )}
      </Box>

      <List>
        {ordersList.map((order) => (
          <ProductItem order={order} key={order.id} />
        ))}
      </List>

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
export default OrdersList;
