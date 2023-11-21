"use client";
import React, { useMemo, useState } from "react";

import { useContextValue } from "@/app/hooks/useContextValue";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Rating,
  TextField,
  Typography
} from "@mui/material";

import CartDrawer from "@/app/(store)/cart/CartDrawer";

import { IItem } from "@/app/types/cart";
import calculateDiscount from "@/app/utils/calculateDiscount";
import Link from "next/link";
import { ProductWithRelations } from "../actions/actions";

type ProductInfoProps = {
  product: ProductWithRelations;
};

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [openCartD, setOpenCartD] = React.useState(false);
  const handleToggleCartD = () => setOpenCartD((prevState) => !prevState);

  const {
    state: { cart },
    dispatch,
  } = useContextValue();

  const [options, setOptions] = useState({
    units: 1,
    size: product.sizes[0],
    style: product.styles[0],
    location: product.locations[0],
    color: product.colors[0],
  });

  const handleUpdateOptions = (
    key: keyof typeof options,
    value: string | number
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = () => {
    //dispatch to cart
    dispatch({
      type: "ADD_TO_CART",
      payload: { id: product!.id, product, ...options },
    });
    //open cart
    handleToggleCartD();
  };

  const handleRemoveFromCart = () => {
    //dispatch to cart
    dispatch({ type: "REMOVE_FROM_CART", payload: product!.id });
  };

  //if already in cart
  const isInCart = useMemo(() => {
    return cart.map((item: IItem) => item.id).includes(product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  return (
    <Box px={4}>
      {openCartD && (
        <CartDrawer open={openCartD} handleClose={handleToggleCartD} />
      )}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex" columnGap={3}>
          {product.tags.map((tag, i) => (
            <Chip key={tag + i} label={tag} color="secondary" />
          ))}
        </Box>
        <IconButton>
          <FavoriteBorderOutlinedIcon />
        </IconButton>
      </Box>

      <Typography variant="h3" gutterBottom>
        {product.title}
      </Typography>
      <Typography paragraph>Brand: {product.brand} | Similar items</Typography>

      <Typography variant="h4" color="primary">
        Ksh {product.discountedPrice}
      </Typography>
      <Box display="flex" columnGap={2}>
        <Typography sx={{ textDecoration: "line-through" }} paragraph>
          Ksh {product.price}
        </Typography>

        <Typography paragraph>
          ({calculateDiscount(product.price, product.discountedPrice)}% off)
        </Typography>
      </Box>

      <Box display="flex" columnGap={2} alignItems="center" mb={2}>
        <Rating name="read-only" value={product.rating} readOnly />

        <Typography
          component={Link}
          href={`/product/${product.id}#reviews`}
          sx={{ textDecoration: "underline" }}
        >
          {product.totalReviews} reviews
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        Style
      </Typography>

      <Box
        display="flex"
        gap={2}
        alignContent="space-between"
        flexWrap="wrap"
        mb={2}
      >
        {product.styles?.map((style, index) => (
          <Button
            variant={options.style === style ? "contained" : "outlined"}
            key={index}
            color="secondary"
            onClick={() => handleUpdateOptions("style", style)}
          >
            {style}
          </Button>
        ))}
      </Box>

      <Typography variant="h6" paragraph>
        Color
      </Typography>
      <Box
        display="flex"
        gap={2}
        alignContent="space-between"
        flexWrap="wrap"
        mb={2}
      >
        {product.colors?.map((color, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: color,
              height: 40,
              width: 40,
              borderRadius: "50%",
              cursor: "pointer",
              border: options.color === color ? 2 : 0,
            }}
            onClick={() => handleUpdateOptions("color", color)}
          />
        ))}
      </Box>

      <Typography variant="h6" paragraph>
        Size
      </Typography>
      <Box
        display="flex"
        gap={2}
        alignContent="space-between"
        flexWrap="wrap"
        mb={2}
      >
        {product.sizes?.map((size, index) => (
          <Button
            variant={options.size === size ? "contained" : "outlined"}
            key={index}
            color="secondary"
            onClick={() => handleUpdateOptions("size", size)}
          >
            {size}
          </Button>
        ))}
      </Box>

      <Typography variant="h6" paragraph>
        Print location
      </Typography>
      <Box
        display="flex"
        gap={2}
        alignContent="space-between"
        flexWrap="wrap"
        mb={3}
      >
        {product.locations?.map((location, index) => (
          <Button
            key={index}
            variant={options.location === location ? "contained" : "outlined"}
            color="secondary"
            onClick={() => handleUpdateOptions("location", location)}
          >
            {location}
          </Button>
        ))}
      </Box>

      <Divider />
      <Box
        display="flex"
        justifyContent="space-between"
        bgcolor="dull.main"
        p={2}
        mb={4}
      >
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">
          Ksh {options.units * product.discountedPrice}
        </Typography>
      </Box>

      <Box display="flex" columnGap={3}>
        <Box display="flex" columnGap={1}>
          <Button
            disabled={isInCart}
            variant="outlined"
            onClick={() =>
              handleUpdateOptions(
                "units",
                options.units !== 1 ? options.units - 1 : options.units
              )
            }
          >
            <RemoveOutlinedIcon />
          </Button>
          <TextField
            disabled={isInCart}
            type="number"
            value={options.units}
            onChange={(e) =>
              handleUpdateOptions(
                "units",
                parseInt(e.target.value) === 0
                  ? options.units
                  : parseInt(e.target.value)
              )
            }
          />
          <Button
            disabled={isInCart}
            variant="outlined"
            onClick={() => handleUpdateOptions("units", options.units + 1)}
          >
            <AddOutlinedIcon />
          </Button>
        </Box>

        {isInCart ? (
          <Button
            color="error"
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => handleRemoveFromCart()}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Remove from cart
          </Button>
        ) : (
          <Button
            startIcon={<AddShoppingCartIcon />}
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => handleAddToCart()}
          >
            Add to cart
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProductInfo;
