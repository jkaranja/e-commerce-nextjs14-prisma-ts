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

  const [ordersList, setOrdersList] = useState<OrderWithProducts[]>([]);

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getOrders({ page, itemsPerPage });
        setOrdersList(data?.orders || []);
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
      <Box py={2} px={3}>
        {isPending ? (
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
