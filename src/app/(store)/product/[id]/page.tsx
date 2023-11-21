"use client";
import React, { useEffect, useState, useTransition } from "react";

import {
  Box,
  CircularProgress,
  Tabs,
  Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import MyTab from "@/app/components/MyTab";
import TabPanel from "@/app/components/TabPanel";
import { useSession } from "next-auth/react";
import { ProductWithRelations, getProduct } from "./actions/actions";
import Description from "./components/Description";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import Reviews from "./components/Reviews";
import Shipping from "./components/Shipping";

type ProductDetailsProps = { 
  params: { id: string };
};

const ProductDetails = ({ params: { id } }: ProductDetailsProps) => {
  //Authentication
  const { data: session, status, update } = useSession();

  const [isPending, startTransition] = useTransition();

  const [product, setProduct] = useState<ProductWithRelations | null>(null);

  const [tabValue, setTabValue] = useState<string>("description");

  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    setTabValue(tabValue);
  };

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getProduct(id);
        setProduct(data || {});
      } catch (error: any) {
        //toast.info(error.message as string);
      }
    });
  }, [id]); 

  if (!product)
    return (
      <Box textAlign="center">
        <CircularProgress color="inherit" />
      </Box>
    );

  return (
    <Box>
      <Grid2
        container
        justifyContent="space-between" //xs below stretches/flex grow div vertically
        // alignItems="stretch" ///fill full width
        mb={4}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Grid2 xs>
          <ProductImages product={product} />
        </Grid2>

        <Grid2 xs>
          <ProductInfo product={product} />
        </Grid2>
      </Grid2>

      <Box sx={{ borderBottom: 1, borderColor: "dull.light" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable" //By default, left and right scroll buttons are automatically presented on desktop and hidden on mobile.
          scrollButtons="auto" //default 'auto' //only present scroll buttons when not all the items are visible.
          allowScrollButtonsMobile //Present scroll buttons always regardless of the viewport width on mobile//keep this
        >
          <MyTab
            //   icon={<PersonOutlineOutlinedIcon />}
            //   iconPosition="start"
            label={
              <Box sx={{ display: "flex" }}>
                <Typography pl={1}>Description</Typography>
              </Box>
            }
            value="description"
          />

          <MyTab
            label={
              <Box sx={{ display: "flex" }}>
                <Typography pl={1}>Shipping information</Typography>
              </Box>
            }
            value="shipping"
          />
        </Tabs>
      </Box>

      <Box mb={4}>
        {/* ----------------------description TAB -------------------------*/}
        <TabPanel value={tabValue} index="description">
          <Description product={product} />
          <Reviews product={product} />
        </TabPanel>

        {/* ---------------------shipping------------------------ */}
        <TabPanel value={tabValue} index="shipping">
          <Shipping product={product} />
        </TabPanel>
      </Box>

      {/* <Box>
        <RelatedProducts product={product} />
      </Box> */}
    </Box>
  );
};

export default ProductDetails;
