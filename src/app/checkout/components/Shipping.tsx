"use client";
import React, { useEffect } from "react";

import Radio from "@mui/material/Radio";

import List from "@mui/material/List";

import ListItemButton from "@mui/material/ListItemButton";

import { useContextValue } from "@/app/hooks/useContextValue";
import { Box, ListItem, ListItemText, Typography } from "@mui/material";

const Shipping = () => {
  const {
    state: { cart, order },
    dispatch,
  } = useContextValue();

  const [selectedValue, setSelectedValue] = React.useState("economy");

  const [charges, setCharges] = React.useState({
    economy: 500,
    standard: 700,
    express: 900,
  });

  //dispatch shipping amount on shipping mtd change
  useEffect(() => {
    dispatch({
      type: "UPDATE_ORDER",
      payload: {
        shipping: charges[selectedValue as keyof typeof charges],
        total:
          order.subTotal -
          (order.discount || 0) +
          charges[selectedValue as keyof typeof charges],
      },
    });
  }, [selectedValue]);

  return (
    <Box>
      <Typography variant="h6" paragraph>
        Shipping method
      </Typography>

      <List>
        {Object.entries(charges).map(([mtd, amount], index) => (
          <ListItem
            key={index}
            disablePadding
            alignItems="flex-start"
            secondaryAction={<Typography>Ksh {amount}</Typography>}
          >
            <ListItemButton
              onClick={() => setSelectedValue(mtd)}
              selected={
                charges[selectedValue as keyof typeof charges] === amount
              }
            >
              <Radio
                value={mtd}
                // onChange={handleChange}
                checked={
                  charges[selectedValue as keyof typeof charges] === amount
                }
              />

              <ListItemText
                primary={
                  <Typography textTransform="capitalize">{mtd}</Typography>
                }
                secondary={
                  <Typography>
                    {mtd === "standard" && "5 to 8 business days"}
                    {mtd === "economy" && "3 to 4 business days"}
                    {mtd === "express" && "Same day delivery(within 24 hours)"}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Shipping;
