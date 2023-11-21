"use client";
import { Box, Tabs, Typography } from "@mui/material";
import React, { useState, useTransition, useEffect } from "react";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import LockOpenIcon from "@mui/icons-material/LockOpen";

import MyTab from "../../components/MyTab";
import TabPanel from "../../components/TabPanel";

import Account from "./components/Account";
import Address from "./components/Address";
import Security from "./components/Security";
import { getUser } from "./actions/actions";
import { User } from "@prisma/client";

const Settings = () => {
  const [tabValue, setTabValue] = useState<string>("account");

  const [isPending, startTransition] = useTransition();

  const [user, setUser] = useState<User | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    //change tab
    setTabValue(tabValue);
  };

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch (error: any) {
        //toast.info(error.message as string);
      }
    });
  }, []);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h6" paragraph>
        Settings
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "dull.light" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          textColor="primary"
          indicatorColor="primary"
          //variant="fullWidth"
          // centered  //center tabs
          //orientation =	'horizontal'| 'vertical'	'horizontal'
          variant="scrollable" //By default, left and right scroll buttons are automatically presented on desktop and hidden on mobile.
          scrollButtons="auto" //default 'auto' //only present scroll buttons when not all the items are visible.
          //scrollButtons//true //Present scroll buttons always regardless of the viewport width on desktop(reserve space)
          //scrollButtons={false}//Prevent scroll buttons
          allowScrollButtonsMobile //Present scroll buttons always regardless of the viewport width on mobile//keep this
          TabScrollButtonProps={{
            //	Props applied to the TabScrollButton element.
            //sx: { bgcolor: "red" },            //
            slotProps: {
              startScrollButtonIcon: { fontSize: "large" },
              endScrollButtonIcon: { fontSize: "large" },
            },
          }}
          //visibleScrollbar	bool	false	//If true, the scrollbar is visible. It can be useful when displaying a long vertical list of tabs.
        >
          <MyTab
            //   icon={<PersonOutlineOutlinedIcon />}
            //   iconPosition="start"
            label={
              <Box sx={{ display: "flex" }}>
                <PersonOutlineOutlinedIcon />
                <Typography pl={1}>Account</Typography>
              </Box>
            }
            value="account"
          />
          <MyTab
            //   icon={<PersonOutlineOutlinedIcon />}
            //   iconPosition="start"
            label={
              <Box sx={{ display: "flex" }}>
                <PersonOutlineOutlinedIcon />
                <Typography pl={1}>Shipping address</Typography>
              </Box>
            }
            value="address"
          />

          <MyTab
            label={
              <Box sx={{ display: "flex" }}>
                <LockOpenIcon />
                <Typography pl={1}>Security</Typography>
              </Box>
            }
            value="security"
          />
        </Tabs>
      </Box>

      <Box>
        {/* ----------------------UPDATE/DEL ACCOUNT TAB -------------------------*/}
        <TabPanel value={tabValue} index="account">
          {user && <Account user={user} />}
          {/* <CloseAccount user={user!} /> */}
        </TabPanel>

        {/* ---------------------SECURITY TAB/PWD + 2FACTOR------------------------ */}
        <TabPanel value={tabValue} index="address">
          {user && <Address user={user} />}
          {/* {user && <TwoFactor user={user} />} */}
        </TabPanel>

        {/* ---------------------SECURITY TAB/PWD + 2FACTOR------------------------ */}
        <TabPanel value={tabValue} index="security">
          {user && <Security user={user} />}
          {/* {user && <TwoFactor user={user} />} */}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Settings;
