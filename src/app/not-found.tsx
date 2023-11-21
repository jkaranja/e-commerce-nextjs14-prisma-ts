import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box minHeight="90vh" textAlign="center" pt={6}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h6" paragraph>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="muted.dark">
        We couldn&apos;t find the page you are looking for.
      </Typography>

      <Box my={8}>
        <Button
          //color="secondary"
          variant="contained"
          size="large"
          component={Link}
          href="/"
        >
          Return Home
        </Button>
      </Box>
    </Box>
  );
}
