import Logout from "@mui/icons-material/Logout";
import {
  AppBar,
  CircularProgress,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { signOut } from "next-auth/react";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";

import { useRouter } from "next/navigation";

type DashHeaderProps = {
  handleSidebarToggle: () => void;
};

const Header = ({ handleSidebarToggle }: DashHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorE, setAnchorE] = useState<null | HTMLElement>(null);

  const router = useRouter()

  //for adding border bottom on scroll
  const matches = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  /**------------------------------
   * NOTIFICATIONS MENU
   -------------------------------------*/
  const openN = Boolean(anchorE);
  const handleNMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE(event.currentTarget);
  };
  const handleNClose = () => {
    setAnchorE(null);
  };

  /**------------------------------
   * ACCOUNT MENU
   -------------------------------------*/
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**------------------------------
   * Handle Logout
   -------------------------------------*/
  //this calls logOut() to clear token in the store
  //   const handleLogout = async () => {
  //     await sendLogout();
  //   };

  //   //feedback
  //   useEffect(() => {
  //     //redirect user to home on success
  //     if (isSuccess) navigate("/");

  //     if (isError) toast.error(error as string);

  //     return () => toast.dismiss();
  //   }, [isError, isSuccess]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "gray.main",
          px: 3,
        }}
        elevation={matches ? 1 : 0}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ color: "dark.main", mr: "auto", display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />

          <IconButton sx={{ mr: 3 }} onClick={handleNMenu}>
            {/* <Badge color="secondary" badgeContent={4} max={999}> */}
            <NotificationsNoneIcon
              sx={{ color: "dark.main", width: 25, height: 25 }}
            />
            {/* </Badge> */}
          </IconButton>

          {/* <Menu
            anchorEl={anchorE}
            open={openN}
            onClose={handleNClose}
            onClick={handleNClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* <NotificationsList
              isFetching={isFetching}
              unreadChats={unreadChats!}
              totalUnread={totalUnread!}
            /> </Menu>*/}

          <Tooltip title="Settings">
            <IconButton
              onClick={handleMenu}
              size="small"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 30, height: 30, bgcolor: "dark.main" }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => router.push("/account/settings")}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" color="secondary" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            {false ? (
              <CircularProgress size={20} color="secondary" />
            ) : (
              <Logout fontSize="small" color="secondary" />
            )}
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
