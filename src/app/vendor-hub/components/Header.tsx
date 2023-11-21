"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const Header = () => {
  return (
    <Box>
      <AppBar
        position="static"
        color="primary"
        component="nav"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          px: 2,
          borderColor: "gray.border",
          borderStyle: "solid",
          borderWidth: "0 0 1px",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-evenly" }}>
          <Typography
            px={3}
            mr="auto"
            color="secondary.main"
            variant="h6"
            fontWeight={400}
            component={Link}
            href="/"
          >
            CustomPrintsKe
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
