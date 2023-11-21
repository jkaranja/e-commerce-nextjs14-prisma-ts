"use client";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { usePathname, useRouter } from "next/navigation";

type SidebarProps = {
  sidebarOpen: boolean;
  handleSidebarToggle: () => void;
  sidebarWidth: number;
};

const pages = [
  {
    label: "My Orders",
    link: " ",
    icon: <ListAltOutlinedIcon />,
    children: [
      {
        link: "orders",
        icon: <ListAltOutlinedIcon />,
        label: "Orders",
      },
      {
        link: "reviews",
        icon: <ListAltOutlinedIcon />,
        label: "Review products",
      },
    ],
  },
  {
    label: "Vouchers",
    link: "vouchers",
    icon: <ListAltOutlinedIcon />,
  },
];

const Sidebar = ({
  sidebarOpen,
  handleSidebarToggle,
  sidebarWidth,
}: SidebarProps) => {
  const pathname = usePathname();

  const router = useRouter();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  //close responsive drawer when user click a link
  const navigateTo = (link: string) => {
    //toggle sidebar/close drawer only for floating drawer visible below < md
    if (matches) handleSidebarToggle();
    //go to page
    router.push(link);
  };

  ///drawer content//used in both mobile and desktop sizes drawers
  const drawer = (
    <Box sx={{ overflow: "auto" }}>
      <Box display="flex" py={2} px={1}>
        <Typography
          component="span"
          variant="h6"
          sx={{
            flex: 1,
            textDecoration: "none",
            color: "primary.main",
            cursor: "pointer",
          }}
          onClick={() => navigateTo("/")}
          id="logo"
        >
          CustomPrintsKE
        </Typography>
        <IconButton
          color="inherit"
          onClick={handleSidebarToggle}
          sx={{ display: { md: "none" } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <List>
        {pages.map(({ label, link, icon, children }, index) => (
          <ListItem
            key={link}
            disablePadding
            // className={pathname === `${link}` ? "listItem-active" : ""}
          >
            {!children ? (
              <ListItemButton onClick={() => navigateTo(`/account/${link}`)}>
                <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>
                <ListItemText primary={<Typography>{label}</Typography>} />
              </ListItemButton>
            ) : (
              <Accordion
                disableGutters
                elevation={0}
                square
                sx={{ width: "100%" }}
                //expanded={true}
                defaultExpanded
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRight: pathname.startsWith(label) ? 3 : 0,
                    borderColor: "primary.main",
                    bgcolor: "rgba(36, 33, 69, 1)",
                    color: "rgba(231, 227, 252)",
                  }}
                >
                  {icon}

                  <Typography sx={{ px: 1 }}>{label}</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <List
                    sx={{
                      py: 0,
                      bgcolor: "rgba(36, 33, 69, 0.94)",
                    }}
                  >
                    {children.map(({ label, link, icon }, index) => (
                      <Box key={index+label}>
                        {/* divider={text !== "Orders"}  rgba(231, 227, 252, 0.08) */}
                        <ListItem
                          key={label}
                          disablePadding
                          sx={{
                            bgcolor: pathname.startsWith(`/account/${link}`)
                              ? "rgba(231, 227, 252, 0.08)"
                              : "",
                          }}
                        >
                          <ListItemButton
                            onClick={() => navigateTo(`/account/${link}`)}
                          >
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText
                              secondaryTypographyProps={{
                                sx: { color: "rgba(231, 227, 252)" },
                              }}
                              sx={{ pl: 2 }}
                              secondary={label}
                            />
                          </ListItemButton>
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* toggle-able mobile drawer// display only from md and down(display ensure drawer hides in case open={true} & size goes past md up//false/closed by default//toggle with btn to show  . */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={handleSidebarToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarWidth,
          },
        }}
        PaperProps={{
          sx: {
            bgcolor: "rgba(36, 33, 69, 1)",
            color: "rgba(231, 227, 252, 0.87)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* initial sidebar/drawer// permanent & persistent don't elevate drawer//display only from md up */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: sidebarWidth,
          },
        }}
        PaperProps={{
          sx: {
            bgcolor: "rgba(36, 33, 69, 1)",
            color: "rgba(231, 227, 252, 0.87)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
