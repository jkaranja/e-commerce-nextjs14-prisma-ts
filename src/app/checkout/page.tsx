import { Suspense } from "react";

import {
  Box,
  Typography
} from "@mui/material";
import Link from "next/link";
import Stepper from "./components/Stepper";

const Checkout = async () => {
  return (
    <Box>
      <Box mb={3}>
        <Typography
          px={3}
          color="primary.main"
          variant="h5"
          fontWeight="bold"
          component={Link}
          href="/"
        >
          CustomPrintsKe
        </Typography>
      </Box>

      <Suspense
        fallback={
          <Box>
            <Typography>Loading...</Typography>
          </Box>
        }
      >
        <Stepper />
      </Suspense>
    </Box>
  );
};

export default Checkout;
