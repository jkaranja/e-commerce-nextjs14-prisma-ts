"use client";
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState, useTransition } from "react";
import { getProducts } from "./actions/actions";
import ProductsList from "./components/ProductsList";

const Home = () => {
   

  const [featuredList, setFeaturedList] = useState<Product[]>([]);
  const [bestSellerList, setBestSellerList] = useState<Product[]>([]);
  const [limitedList, setLimitedList] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      //Parallel Data Fetching: saves time-=> faster->use Promise.all
      //initiate requests in parallel without waiting for current to resolve->Sequential Data Fetching
      //Sequential Data Fetching is used for promises that depend on each other's resolved values
      //Altho resolved value of Promise.all would wait for all promises to resolve, all promises fire without waiting on each other
      //below is even better as we are updating state as soon as any promise resolves
      await Promise.all(
        ["Featured", "Best seller", "Limited Edition"].map(async (tag) => {
          try {
            const data = await getProducts({ tag });
            if (tag === "Featured") {
              setFeaturedList(data);
            }
            if (tag === "Best seller") {
              setBestSellerList(data);
            }
            if (tag === "Limited Edition") {
              setLimitedList(data);
            }

            return data;
          } catch (error) {
            //return //prevent chain from
          }
        })
      );
    })();
  }, []);
  return (
    <Box>
      <Grid2
        container
        justifyContent="space-between" //xs below stretches/flex grow Typography vertically
        // alignItems="stretch" ///fill full width
        mb={4}
        flexDirection={{ xs: "column", md: "row" }}
        columnGap={3}
      >
        <Grid2
          xs
          mb={1}
          className="hero-wrap"
          p={5}
          container
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          rowGap={5}
        >
          <Box>
            <Typography
              paragraph
              variant="h4"
              fontWeight={900}
              color="#fff"
              textTransform="capitalize"
              mb={3}
            >
              Holiday deals on custom printed T-shirts
            </Typography>

            <Typography
              paragraph
              variant="h6"
              color="#fff"
              textTransform="capitalize"
            >
              Up to 40% off on all items — Pay less for more
            </Typography>
          </Box>
          <Button
            size="large"
            variant="contained"
            component={Link}
            href="/shop"
          >
            Shop now
          </Button>
          {/* <Image
          src="/banner.jpg" //File or Fetched file url
          alt="banner"
          loading="lazy"
          height={600}
          width={110}
          style={{ objectFit: "cover", width: "100%" }}
        /> */}
          {/* <CardMedia
            sx={{ height: 500, borderRadius: 2 }}
            image="/banner.jpg"
            title="banner"
          /> */}
        </Grid2>

        <Grid2 xs md={3}>
          <Stack
            spacing={2}
            direction={{ xs: "column" }}
            //est seller", "Holiday T-shirts", "Christmas deals"
          >
            {[
              { label: "Best seller", img: "/best-seller.webp" },
              { label: "Holiday T-shirts", img: "/design.jpg" },
              { label: "Christmas deals", img: "/Men-T-shirt.webp" },
            ].map(({ label, img }, i) => (
              <Box key={i} height={155} position="relative" borderRadius={2}>
                <Image
                  src={img} //File or Fetched file url
                  alt={img}
                  loading="lazy"
                  sizes="(min-width: 808px) 50vw, 100vw"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <Box position="absolute" bottom={0} width="100%">
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ borderRadius: 0 }}
                    disableElevation
                    component={Link}
                    href="/shop"
                  >
                    {label}
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Grid2>
      </Grid2>

      <Box my={3}>
        {!featuredList.length ? (
          <CircularProgress color="inherit" />
        ) : (
          <Typography variant="h4" paragraph>
            Featured T Shirts
          </Typography>
        )}
      </Box>

      <Suspense fallback={<Typography>Loading...</Typography>}>
        <ProductsList products={featuredList} />
      </Suspense>

      <Box my={3}>
        {!bestSellerList.length ? (
          <CircularProgress color="inherit" />
        ) : (
          <Typography variant="h4" paragraph>
            Best seller T Shirts
          </Typography>
        )}
      </Box>
      <Suspense fallback={<Typography>Loading...</Typography>}>
        <ProductsList products={bestSellerList} />
      </Suspense>

      <Box my={3}>
        {!limitedList.length ? (
          <CircularProgress color="inherit" />
        ) : (
          <Typography variant="h4" paragraph>
            Limited Edition
          </Typography>
        )}
      </Box>
      <Suspense fallback={<Typography>Loading...</Typography>}>
        <ProductsList products={limitedList} />
      </Suspense>
    </Box>
  );
};

export default Home;
