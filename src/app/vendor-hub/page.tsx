"use client";
import { Paper, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

import MyTab from "@/app/components/MyTab";
import TabPanel from "@/app/components/TabPanel";
import { useFormState } from "react-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegisterForm, createAccount } from "./actions/createAccount";
import RegisterForm from "./components/RegisterForm";
import SignInForm from "./components/SignInForm";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Role } from "../types/user";

const Auth = () => {
  const [tabValue, setTabValue] = React.useState<string>("signin");

  const router = useRouter();

  const [state, formAction] = useFormState(createAccount, null);

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

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onRegisterSubmit: SubmitHandler<IRegisterForm> = async (data) => {

    await formAction({ ...data, roles: [Role.Vendor] });
  };

  /**--------------------------------
   HANDLE LOGIN SUBMIT
 -------------------------------------*/
  const onLoginSubmit: SubmitHandler<Omit<IRegisterForm, "username">> = async (
    data
  ) => {
    //await login({ phoneNumber: data.phoneNumber, password: data.password });
    setIsAuthenticating(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      role: Role.Vendor,
      redirect: false,
    }).then((result) => {
      setIsAuthenticating(false);
      ///result = { error, status, ok, url }: { error: string | undefined//error codes, status: number, ok: boolean, url: string | null};
      if (result?.error && !result.ok) {
        return toast.error(result.error);
      }
      router.push("/vendor/dashboard"); //close modal
    });
  };

  //feedback
  useEffect(() => {
    if (state?.message) toast.error(state?.message as string);
  }, [state]);

  return (
    <Box component={Paper} p={3}>
      <Typography variant="h3" paragraph>
        Vendor Hub
      </Typography>

      <Typography paragraph gutterBottom>
        Sign in or create an account to start selling your products on our
        platform
      </Typography>

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
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Auth;
