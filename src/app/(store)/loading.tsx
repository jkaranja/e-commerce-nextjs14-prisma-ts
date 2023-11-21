import {
  Box,
  CircularProgress
} from "@mui/material";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Box textAlign="center">
      <CircularProgress color="inherit" />
    </Box>
  );
}
