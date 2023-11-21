import { Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import React, { useTransition } from "react";
import { toast } from "react-toastify";

import MyTab from "@/app/components/MyTab";
import TabPanel from "@/app/components/TabPanel";
import CloseIcon from "@mui/icons-material/Close";
import { SubmitHandler, useForm } from "react-hook-form";
import RegisterForm from "./RegisterForm";
import SignInForm from "./SignInForm";
import { IRegisterForm, createAccount } from "./actions/createAccount";

import { Role } from "@/app/types/user";
import { signIn } from "next-auth/react";

//drawer
const drawerWidth = 450;

type AuthDrawerProps = {
  open: boolean;
  handleClose: () => void;
};

const AuthDrawer = ({ handleClose, open }: AuthDrawerProps) => {
  const [tabValue, setTabValue] = React.useState<string>("signin");

  const [isPending, startTransition] = useTransition();

  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    setTabValue(tabValue);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
  } = useForm<IRegisterForm>();

  //Authentication-> kick out if Unauthenticated
  // const {
  //   data: session,
  //   status,
  //   update,
  // } = useSession({
  //   required: true,
  //   onUnauthenticated: () => redirect("/"),
  // });

  /**--------------------------------
   HANDLE LOGIN SUBMIT
 -------------------------------------*/
  const signInWithNextAuth = (data: IRegisterForm) => {
    setIsAuthenticating(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      role: Role.Buyer,
      redirect: false,
    }).then((result) => {
      setIsAuthenticating(false);
      ///result = { error, status, ok, url }: { error: string | undefined//error codes, status: number, ok: boolean, url: string | null};
      if (result?.error && !result.ok) {
        return toast.error(result.error);
      }
      handleClose(); //close modal
    });
  };

  const onLoginSubmit: SubmitHandler<IRegisterForm> = async (data) => {
    signInWithNextAuth(data);
  };

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onRegisterSubmit: SubmitHandler<IRegisterForm> = async (data) => {
    startTransition(async () => {
      try {
        const result = await createAccount(data);
        toast.success(result.message as string);
        //success: sign in the user with next-auth
        signInWithNextAuth(data);
      } catch (error: any) {
        toast.error(error.message as string);
      }
    });
  };

  return (
    <Drawer
      anchor="right" //| left | "right"| "bottom" | "top"
      variant="temporary"
      open={open}
      onClose={handleClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
      PaperProps={{
        sx: {
          //bgcolor: "secondary.dark",
          //color: "dull.main",
          px: 3,
        },
      }}
    >
      <Box textAlign="right" py={2}>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "dull.light" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
        >
          <MyTab
            //   icon={<PersonOutlineOutlinedIcon />}
            //   iconPosition="start"
            label={
              <Box sx={{ display: "flex" }}>
                <Typography pl={1}> Sign in</Typography>
              </Box>
            }
            value="signin"
          />

          <MyTab
            label={
              <Box sx={{ display: "flex" }}>
                <Typography pl={1}>Create account</Typography>
              </Box>
            }
            value="register"
          />
        </Tabs>
      </Box>

      <Box>
        <TabPanel value={tabValue} index="signin">
          <SignInForm
            handleSubmit={handleSubmit(onLoginSubmit)}
            errors={errors}
            control={control}
            register={register}
            isLoading={isAuthenticating}
          />
        </TabPanel>

        <TabPanel value={tabValue} index="register">
          <RegisterForm
            handleSubmit={handleSubmit(onRegisterSubmit)}
            errors={errors}
            control={control}
            register={register}
            isLoading={isPending}
          />
        </TabPanel>
      </Box>
    </Drawer>
  );
};

export default AuthDrawer;
