"use client";
import {
  Box,
  Button,
  Paper,
  Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
const Vouchers = () => {
  const router = useRouter();
  return (
    <Box component={Paper} p={4}>
      
      <Box
        minHeight="35vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography paragraph>
          You currently have no available Vouchers
        </Typography>
        <Typography paragraph>
          All your available Vouchers will be displayed here
        </Typography>

        <Button variant="outlined" onClick={() => router.push("/shop")}>
          Continue shopping
        </Button>
      </Box>
    </Box>
  );
};

export default Vouchers;
