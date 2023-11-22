import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Metadata } from "next";
import Header from "./components/Header";
import SubHeader from "./components/SubHeader";

//can add metadata in layout.js or page.js file.
//Both static and dynamic metadata through generateMetadata are only supported in Server Components.
export const metadata: Metadata = {
  title: "CustomPrintsKe",
  description: "Best T Shirt designs",
};

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid2
      container
      direction="column"
      justifyContent="space-between" //xs below stretches/flex grow div vertically
      // alignItems="stretch" ///fill full width
      minHeight="100vh"
      // bgcolor="#F4F5FA"
    >
      <Grid2 className="back-to-top-anchor">
        <Header />
        <SubHeader />
      </Grid2>

      <Grid2 xs container justifyContent="center">
        <Box
          width={{ xs: "100vw", md: "90vw", lg: "90vw", xl: "80vw" }}
          //width={{ xs: "100vw", lg: 1250 }}
          px={3}
          py={4}
        >
          {children}
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default StoreLayout;
