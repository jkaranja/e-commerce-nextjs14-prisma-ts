import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";

import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import {
  FieldErrors,
  UseFormRegister
} from "react-hook-form";
import { AccountInputs } from "./Account";

const MEGA_BYTES_PER_BYTE = 1e6;
const convertBytesToMB = (bytes: number) =>
  Math.round(bytes / MEGA_BYTES_PER_BYTE);

type ConfirmPwdProps = {
  open: boolean;
  isLoading: boolean;
  handleClose: () => void;
  register: UseFormRegister<AccountInputs>;
  errors: FieldErrors<AccountInputs>;
  handleSubmit: () => Promise<void>;
};

const ConfirmPwd = ({
  open,
  handleClose,
  handleSubmit,
  register,
  errors,
  isLoading,
}: ConfirmPwdProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box>
      <Dialog
        fullWidth //works together with max width
        maxWidth="sm" //default is small
        open={open}
        //onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" gutterBottom>
              Enter password to save changes
            </Typography>

            <IconButton size="large" color="default" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Please enter your current password below
          </DialogContentText>

          <FormGroup sx={{ my: 2 }}>
            <TextField
              {...register("password", {
                required: "Password is required",
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
            />
            <Typography color="error.main" variant="caption">
              {errors.password?.message}
            </Typography>
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 4 }}>
          <Button
            variant="contained"
            disabled={isLoading}
            endIcon={
              isLoading && <CircularProgress size={20} color="inherit" />
            }
            onClick={handleSubmit}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfirmPwd;
