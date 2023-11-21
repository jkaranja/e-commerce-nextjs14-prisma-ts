"use client";
import { useContextValue } from "@/app/hooks/useContextValue";
import useDebounce from "@/app/hooks/useDebounce";
import useSetSearchParams from "@/app/hooks/useSetSearchParams";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Avatar, Badge, TextField, Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import AuthDrawer from "../auth/AuthDrawer";
import CartDrawer from "../cart/CartDrawer";
import { Role } from "@prisma/client";

//drawer
const drawerWidth = 280;

const Header = () => {
  const { data: session, status, update } = useSession();

  const isAuthorized =
    status === "authenticated" && session?.user?.roles?.includes(Role.BUYER);

  const {
    state: { cart, order },
    dispatch,
  } = useContextValue();

  const createQueryString = useSetSearchParams();

  const [title, setTitle] = React.useState("");

  const pathname = usePathname();

  const debouncedQuery = useDebounce(title, 1000);

  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //drawers
  const [openMobileD, setOpenMobileD] = React.useState(false);
  const [openAuthD, setOpenAuthD] = React.useState(false);
  const [openCartD, setOpenCartD] = React.useState(false);
  const handleToggleMobileD = () => setOpenMobileD((prevState) => !prevState);
  const handleToggleAuthD = () => setOpenAuthD((prevState) => !prevState);
  const handleToggleCartD = () => setOpenCartD((prevState) => !prevState);

  React.useEffect(() => {
    if (!debouncedQuery) return;
    //debounce query
    //if not currently in shop page, redirect
    if (pathname !== "/shop") {
      return router.push(`/shop?query=${encodeURIComponent(debouncedQuery)}`);
    }
    //if already there, update query string
    //value will use encodeURIComponent->so use decodeURi... when retrieving
    router.push(`/shop?${createQueryString("q", debouncedQuery)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <Box>
      {openAuthD && (
        <AuthDrawer open={openAuthD} handleClose={handleToggleAuthD} />
      )}
      {openCartD && (
        <CartDrawer open={openCartD} handleClose={handleToggleCartD} />
      )}
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
            color="primary.main"
            variant="h5"
            fontWeight="bold"
            component={Link}
            href="/"
          >
            CustomPrintsKe
          </Typography>

          <IconButton
            size="large"
            edge="start"
            color="secondary"
            aria-label="menu"
            sx={{ mr: 2, color: "dark.main", display: { md: "none" } }}
            onClick={handleToggleMobileD}
          >
            <MenuIcon />
          </IconButton>

          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            color="primary"
            fullWidth
            margin="dense"
            size="small"
            //label="Password"
            placeholder="search products"
            type="search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    // onClick={handleClickShowPassword}

                    edge="end"
                  >
                    <SearchOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: "50vw", px: 3 }}
          />

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button color="secondary" component={Link} href="/vendor-hub">
              Sell your product
            </Button>

            {!isAuthorized && (
              <>
                <Button color="secondary" onClick={handleToggleAuthD}>
                  Login
                </Button>

                <Button color="secondary" onClick={handleToggleAuthD}>
                  Sign up
                </Button>
              </>
            )}

            <Tooltip title="Saved items">
              <IconButton
                size="large"
                edge="start"
                color="secondary"
                sx={{ mx: 3 }}
                component={Link}
                href="/favorites"
              >
                <FavoriteBorderOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Shopping cart">
              <Badge
                badgeContent={cart.length}
                color="warning"
                max={999} //default: 99
                overlap="circular"
                //anchorOrigin={{ vertical: 'top',horizontal: 'right',}}//move the badge to any corner
                // showZero
              >
                <IconButton
                  size="large"
                  edge="start"
                  color="secondary"
                  onClick={handleToggleCartD}
                >
                  <ShoppingCartOutlinedIcon />
                </IconButton>
              </Badge>
            </Tooltip>

            {isAuthorized && (
              <Tooltip title="Saved items">
                <IconButton
                  size="medium"
                  edge="start"
                  color="secondary"
                  onClick={handleClick}
                  sx={{ mx: 3 }}
                >
                  <Avatar src="/" sx={{ width: 35, height: 35 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => router.push("/account/orders")}>
          <ListItemIcon>
            <CasesOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="My orders" />
        </MenuItem>

        <MenuItem onClick={() => router.push("/account/settings")}>
          <ListItemIcon>
            <PersonOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </MenuItem>

        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>

          <ListItemText primary="Log out" />
        </MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        open={openMobileD}
        onClose={handleToggleMobileD}
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
          <IconButton onClick={handleToggleMobileD}>
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

export default Header;
