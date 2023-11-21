import React from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Paper,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";

const Dashboard = () => {
  return (
    <Box component={Paper} p={4} minHeight="70vh">
      <Grid2 container spacing={1.5} columns={{ xs: 4, sm: 8, md: 12 }} mb={6}>
        {[
          {
            link: "vendor/products",
            category: "Products",
            icon: <InventoryOutlinedIcon color="primary" fontSize="large" />,
            total: 1563,
          },

          {
            link: "vendor/orders",
            category: "Orders",
            icon: <ShoppingCartOutlinedIcon color="primary" fontSize="large" />,
            total: 1000,
          },
          {
            link: "vendor/orders",
            category: "Transactions",
            icon: <TrendingUpOutlinedIcon color="primary" fontSize="large" />,
            total: 864,
          },
        ].map(({ category, icon, link, total }, i) => (
          <Grid2 key={link + i} xs={4}>
            <Card variant="outlined">
              <CardHeader
                avatar={icon}
                title={<Typography variant="h6">{category}</Typography>}
                subheader={<Typography>{total}</Typography>}
              />
              <CardActions sx={{ py: 0 }}>
                <Button
                  component={Link}
                  href={`/${link}`}
                  endIcon={<ArrowRightAltOutlinedIcon />}
                >
                  {category}
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Grid2 container spacing={1.5} columns={{ xs: 4, sm: 8, md: 12 }}>
        {[
          {
            link: "vendor/products",
            category: "Total Earning",
            icon: (
              <BarChartOutlinedIcon
                color="error"
                sx={{ width: 340, height: 150 }}
              />
            ),
            total: "$10500",
          },

          {
            link: "vendor/orders",
            category: "Total sales",
            icon: (
              <TimelineOutlinedIcon
                color="secondary"
                fontSize="large"
                sx={{ width: 340, height: 150 }}
              />
            ),
            total: 1300,
          },
          {
            link: "vendor/orders",
            category: "Impressions",
            icon: (
              <InsightsOutlinedIcon
                color="info"
                fontSize="large"
                sx={{ width: 340, height: 150 }}
              />
            ),
            total: 1864,
          },
        ].map(({ category, icon, link, total }, i) => (
          <Grid2 key={link + i} xs={4}>
            <Card variant="outlined">
              <CardHeader
                title={<Typography variant="h6">{category}</Typography>}
                subheader={<Typography>{total}</Typography>}
              />
              <CardContent sx={{ py: 0 }}>{icon}</CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default Dashboard;
