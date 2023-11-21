"use client";
import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { usePathname } from "next/navigation";
import Header from "./components/Header";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <Grid2
      container
      direction="column"
      justifyContent="space-between" //xs below stretches/flex grow div vertically
      // alignItems="stretch" ///fill full width
      minHeight="100vh"
      // bgcolor="#F4F5FA"
    >
      <Grid2>
        <Header />
      </Grid2>

      <Grid2 xs container justifyContent="center">
        <Box
          width={{ xs: "100vw", md: "70vw", lg: "50vw", xl: "40vw" }}
          //width={{ xs: "100vw", lg: 1250 }}
          px={3}
          pt={6}
        >
          {children}
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default StoreLayout;
