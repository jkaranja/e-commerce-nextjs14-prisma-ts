"use client";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  IconButton
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

type ProductImagesProps = {
  product: Product;
};

const ProductImages = ({ product }: ProductImagesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const maxItems = product.images?.length || 0;

  //handle next btn
  const handleNext = () => {
    if (activeIndex === maxItems - 1) return setActiveIndex(0); //loop from start
    setActiveIndex((prev) => prev + 1);
  };

  //handle back btn
  const handleBack = () => {
    if (activeIndex === 0) return setActiveIndex(maxItems - 1); //loop from end
    setActiveIndex((prev) => prev - 1);
  };

  return (
    <Box>
      <Grid2
        container
        justifyContent="space-between" //xs below stretches/flex grow div vertically
        // alignItems="stretch" ///fill full width
        mb={4}
      >
        <Grid2
          xs="auto"
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          rowGap={1}
        >
          <IconButton onClick={handleBack} size="small" color="secondary">
            <KeyboardArrowUpIcon fontSize="large" />
          </IconButton>

          <Box flexGrow={1} maxHeight={880} overflow="auto">
            {product.images.map((image, i) => (
              <Image
                onClick={() => setActiveIndex(i)}
                key={image.url + i}
                src={image.url}
                alt="Picture of the author"
                width={100}
                height={100}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: 3,
                  cursor: "pointer",
                }}
              />
            ))}
          </Box>

          <IconButton
            onClick={handleNext}             
            color="secondary"
          >
            <KeyboardArrowDownIcon fontSize="large" color="inherit" />
          </IconButton>
        </Grid2>

        <Grid2 xs>
          <Image
            src={product.images[activeIndex].url}
            alt="Picture of the author"
            width={400}
            height={900}
            style={{ width: "100%", objectFit: "cover", borderRadius: 3 }}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ProductImages;
