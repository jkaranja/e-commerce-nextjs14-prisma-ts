"use client";

import { useFormStatus } from "react-dom";

import {
  Avatar,
  Button,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

type SubmitButtonProps = {
  children: React.ReactNode | string;
} & Record<string, any>;

const SubmitButton = ({ children, ...props }: SubmitButtonProps) => {
  //The useFormStatus hook can only be used as a child of a form element using a Server Action.
  const { pending } = useFormStatus();

  //useFormStatus is a Hook that gives you status information of the last form submission.
  //const { pending, data, method, action } = useFormStatus();

  return (
    <Button
      //aria-disabled={pending}
      disabled={pending}
      endIcon={pending && <CircularProgress size={20} color="inherit" />}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
