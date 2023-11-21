"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

import React from "react";
import { ContextProvider } from "./context/Provider";

//next-auth conf
// https://medium.com/ascentic-technology/authentication-with-next-js-13-and-next-auth-9c69d55d6bfd
//https://next-auth.js.org/getting-started/client#sessionprovider
//https://next-auth.js.org/getting-started/example

//To be able to use useSession first you'll need to expose the session context, <SessionProvider />, at the top level of your application



type ProvidersProps = {
  children: React.ReactNode;
  session: any;
};



const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <>
      <ContextProvider>
        <SessionProvider session={session}>{children}</SessionProvider>
      </ContextProvider>
      <ToastContainer
        theme="dark"
        autoClose={3000} //in milliseconds || false //if false, no progress bar//
        hideProgressBar={true} //default: false
        //pauseOnFocusLoss={false} //default: true
        pauseOnHover
        closeOnClick //disabled autoClose
        draggable
      />
    </>
  );
};

export default Providers;
