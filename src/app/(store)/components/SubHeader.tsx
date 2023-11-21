"use client";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useRouter } from "next/navigation";
import * as React from "react";

const CATEGORIES = [
  "Holiday Gifts",
  "Culture and Religion",
  "Animals",
  "Family and Friends Gifts",
  "Funny Gifts",
  "Sport",
  "Job",
  "Music T Shirts",
];

//drawer
const drawerWidth = 280;

const SubHeader = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

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
        <Toolbar sx={{ justifyContent: "space-evenly", py: 1 }} variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="menu"
            sx={{ mr: 2, color: "dark.main", display: { md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {CATEGORIES.map((cat, index) => (
              <Button
                size="large"
                color="secondary"
                key={index}
                sx={{ textTransform: "none", fontWeight: "normal" }}
                onClick={() =>
                  router.push(`/shop?c=${encodeURIComponent(cat)}`)
                }
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        PaperProps={{
          sx: {
            //bgcolor: "secondary.dark",
            //color: "dull.main",
          },
        }}
      >
        <Box textAlign="right" py={2}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {Array.from({ length: 5 }, (_, index) => (
            <ListItem key={index} divider>
              <ListItemButton>
                <ListItemText primary="T-shirts" />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default SubHeader;
