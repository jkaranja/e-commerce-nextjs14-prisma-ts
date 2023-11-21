"use client";

import React from "react";

import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";



import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";


const sidebarWidth = 260;

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  //Authentication-> kick out if Unauthenticated
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: true,
    onUnauthenticated: () => redirect("/"),
  });
 

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**------------------------------
   * SIDEBAR TOGGLE
   -------------------------------------*/
  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };
  //sidebar toggle props
  const sidebarProps = {
    sidebarOpen,
    handleSidebarToggle, //on close
    sidebarWidth,
  };

  return (
    <Grid2
      wrap="nowrap" //default//tries to stay in same row
      //spacing={} //horizontal// rowSpacing for vertical
      container //adds flex behavior//span 12 cols //row//display block
      direction="row"
      justifyContent="flex-end"
      alignItems="stretch"
      minHeight="100vh"
      minWidth={sidebarWidth}
      bgcolor="gray.main"
    >
      {/* the width matches that of fixed drawer//the sidebar is fixed i.e floats on top of content/set width to push items to right */}
      {/* when drawer hides in md, the width will also return to zero since it applies from md and up//items will align to left//grid is set to auto//no content */}
      <Grid2 xs="auto" sx={{ minWidth: { md: sidebarWidth } }}>
        <Sidebar {...sidebarProps} />
      </Grid2>

      <Grid2
        xs
        container
        sx={{
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between", //xs below adds flex grow vertically
        }}
      >
        {/* account bar is fixed//add a box with min height to push items down */}
        <Grid2 minHeight={65}>
          <Header handleSidebarToggle={handleSidebarToggle} />
        </Grid2>

        <Grid2 xs py={3} px={{ xs: 3, md: 5, xl: 7 }}>
          <Box minHeight="90vh">{children}</Box>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default AccountLayout;
