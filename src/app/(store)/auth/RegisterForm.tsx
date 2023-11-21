import React, { useState } from "react";

import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Control,
  FieldErrors,
  UseFormRegister
} from "react-hook-form";
import {
  EMAIL_REGEX,
  PWD_REGEX
} from "../../constants/regex";
import { IRegisterForm } from "./actions/createAccount";

type RegisterFormProps = {
  register: UseFormRegister<IRegisterForm>;
  errors: FieldErrors<IRegisterForm>;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
  control: Control<IRegisterForm>;
};

const RegisterForm = ({
  handleSubmit,
  register,
  errors,
  isLoading,
  control,
}: RegisterFormProps) => {
  const [checkPolicy, setCheckPolicy] = useState(true);

  const [showPassword, setShowPassword] = React.useState(false);

  const [pwdCaption, setPwdCaption] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormGroup sx={{ mb: 2 }}>
          <TextField
            {...register("username", {
              required: "Username is required",
            })}
            label="Username"
            margin="dense"
          />
          <Typography color="error.main" variant="caption">
            {errors.username?.message}
          </Typography>
        </FormGroup>

        <FormGroup sx={{ mb: 3 }}>
          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: EMAIL_REGEX,
                message: "Enter an email address",
              },
            })}
            InputLabelProps={{
              shrink: true,
            }}
            label="Email"
            margin="dense"
          />
          <Typography color="error.main" variant="caption">
            {errors.email?.message}
          </Typography>
        </FormGroup>

        {/* ----------pass------------ */}
        <FormGroup sx={{ mb: 0.5 }}>
          <TextField
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Enter at least 6 characters",
              },
              pattern: {
                value: PWD_REGEX,
                message: "Spaces not allowed",
              },
              //option2://value only eg pattern: 'regex', required: true, //then use errors.password && <span>..err</span>
            })}
            color="primary"
            fullWidth
            margin="dense"
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onFocus={() => setPwdCaption(true)}
          />
          <Typography color="error.main" variant="caption">
            {errors.password?.message}
          </Typography>
          {pwdCaption && (
            <Typography variant="caption" color="muted.dark">
              At least 6 characters with no spaces
            </Typography>
          )}
        </FormGroup>

        <FormGroup sx={{ fontSize: "12px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkPolicy}
                onChange={() => setCheckPolicy(!checkPolicy)}
              />
            }
            label={
              <Typography variant="body2" color="muted.dark">
                I agree to privacy policy & terms
              </Typography>
            }
          />
        </FormGroup>

        <Button
          type="submit"
          size="large"
          variant="contained"
          fullWidth
          disabled={isLoading}
          endIcon={isLoading && <CircularProgress size={20} color="inherit" />}
        >
          Sign up
        </Button>
      </form>
    </Box>
  );
};

export default RegisterForm;
