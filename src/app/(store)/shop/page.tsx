"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";

import { Product } from "@prisma/client";
import { getProducts } from "./actions/actions";
import Filters from "./components/Filters";
import ProductsList from "./components/ProductsList";

const Shop = () => {
  const searchParams = useSearchParams();

  const searchQuery = decodeURIComponent(searchParams.get("q") || "");

  const category = decodeURIComponent(searchParams.get("c") || "Holiday gifts");

  //seTransition is a React Hook that lets you update the state without blocking the UI.
  //can also use it to invoke Server Actions in next 13
  const [isPending, startTransition] = useTransition();
  //dialogs
  // const [openAddD, setOpenAddD] = useState(false);
  // const [openEditD, setOpenEditD] = useState(false);
  // const handleToggleAddD = () => setOpenAddD((prev) => !prev);
  // const handleToggleEditD = () => setOpenEditD((prev) => !prev);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [records, setRecords] = useState(0); //total products/records
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const [products, setProducts] = useState<Product[]>([]);

  //filters
  const [filters, setFilters] = useState({
    cat: category,
    subCat: "",
    priceRange: [100, 500000],
    title: searchQuery,
    color: "",
    rating: 0,
    tag: "",
  });

  const handleUpdateFilters = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    //reset page to 1 if filters change & skip this fetch
    //it will then run when page (dependency) is updated
    if (page !== 1) {
      setPage(1);
      return;
    }

    startTransition(async () => {
      try {
        const data = await getProducts({ page, itemsPerPage, filters });
        setProducts(data?.products || []);
        setTotalPages(data?.pages || 0);
        setRecords(data?.total || 0);
      } catch (error: any) {
        //toast.info(error.message as string);
      }
    });
  }, [page, itemsPerPage, filters]);

  /* ----------------------------------------
   HANDLE PAGINATION
   ----------------------------------------*/
  //for custom pagination & mui onchange
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  //update filters from query string
  useEffect(() => {
    if (!searchQuery) filters.title = searchQuery;

    //whenever category changes, reset subCat ="" to match all products in that CAT
    if (!category) {
      filters.cat = category;
      filters.subCat = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, category]);

  return (
    <Box>
      <Grid2
        container
        justifyContent="space-between" //xs below stretches/flex grow div vertically
        // alignItems="stretch" ///fill full width
        minHeight="100vh"
        // bgcolor="#F4F5FA"
      >
        <Grid2 xs="auto">
          <Filters
            filters={filters}
            handleUpdateFilters={handleUpdateFilters}
          />
        </Grid2>

        <Grid2 xs container justifyContent="center">
          <Box
            width={{ xs: "100vw", md: "90vw", lg: "90vw", xl: "80vw" }}
            //width={{ xs: "100vw", lg: 1250 }}
            px={3}
          >
            <Box mb={2}>
              {!products.length && (
                <CircularProgress size={20} color="inherit" />
              )}

              <Suspense
                fallback={
                  <Box py={2} px={3}>
                    <Typography>Loading...</Typography>
                  </Box>
                }
              >
                <Box py={2}>
                  <Typography paragraph>
                    {searchQuery && `Results for "${searchQuery}"`}
                  </Typography>

                  <Typography color="muted.main" paragraph>
                    {!!records && `${records} products`}
                  </Typography>
                </Box>

                <ProductsList
                  products={products}
                  handlePageChange={handlePageChange}
                  totalPages={totalPages}
                  page={page}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                />
              </Suspense>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Shop;
