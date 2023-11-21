import { Button, Paper, TextField, Typography } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";

// Latest version - v3.0.0 with Tree Shaking to reduce bundle size
//https://www.npmjs.com/package/country-state-city //Country.getAllCountries()
//import { Country, State, City } from "country-state-city";
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { City } from "country-state-city";

import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { PHONE_NUMBER_REGEX } from "../../../constants/regex";
import { UserInputs } from "./Account";
import ConfirmPwd from "./ConfirmPwd";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export type AddressInputs = {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  newPassword: string;
  confirmPassword: string;
};

type AddressProps = {
  user: User;
};
const Address = ({ user }: AddressProps) => {
  //dialogs
  const [openPwdD, setOpenPwdD] = useState(false);
  const handleTogglePwdD = () => setOpenPwdD((prev) => !prev);

  //r-hook-from
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<UserInputs>();

  const onSubmit: SubmitHandler<UserInputs> = async (data) => {
    // await updateUser({
    //   username: data.username,
    //   phoneNumber: data.phoneNumber,
    //   email: data.email,
    //   password: data.password,
    // });
  };

  //set defaults
  useEffect(() => {
    // resetForm({
    //   username: user.username,
    //   email: user.email,
    //   phoneNumber: user.phoneNumber,
    // });
  }, [user]);

  //close pass dialog if address inputs error
  useEffect(() => {
    if (Object.keys(errors).length) {
      setOpenPwdD(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(errors).length, submitCount]); //note: passing errors won;t work => errors holds a reference to errors object/won't change

  //feedback

  return (
    <Box component={Paper} p={3}>
      {openPwdD && (
        <ConfirmPwd
          errors={errors}
          register={register}
          isLoading={false}
          handleSubmit={handleSubmit(onSubmit)} //pass the cb returned by handleSubmit(arg)
          open={openPwdD}
          handleClose={handleTogglePwdD}
        />
      )}

      <Box sx={{ maxWidth: { lg: "40vw" } }}>
        <Typography variant="h5" paragraph>
          Contact
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={3} columnGap={2}>
          <FormGroup sx={{ mb: 2, flexGrow: 1 }}>
            <InputLabel sx={{ mb: 1 }}>Phone number</InputLabel>
            <Controller
              name="phoneNumbers.0"
              control={control}
              rules={{
                validate: (value, formValues) =>
                  PHONE_NUMBER_REGEX.test(value) ||
                  "Invalid phone number. Format: +254xxxxxxxxx",
              }}
              render={({ field: { value, onChange, ...field } }) => (
                <PhoneInput
                  country={"ke"}
                  onlyCountries={["ke"]}
                  // inputProps={{ required: true, autoFocus: true }} //	object	props to pass into the input eg  = {{ name: 'phone', required: true, autoFocus: true}}
                  value={value} //input state value
                  onChange={(phone) => onChange(`+${phone}`)} //onChange(value, country: { name, dialCode, countryCode (iso2) }, event, formattedValue)//value = phoneNumber without the '+'
                  countryCodeEditable={false}
                  inputStyle={{ height: 55, width: "100%" }}
                  containerStyle={{ height: 55 }}
                />
              )}
            />
            <Typography color="error.main" variant="caption">
              {errors.phoneNumbers?.[0]?.message}
            </Typography>
          </FormGroup>

          <FormGroup sx={{ mb: 2, flexGrow: 1 }}>
            <InputLabel sx={{ mb: 1 }}>
              Additional phone number(Optional)
            </InputLabel>
            <Controller
              name="phoneNumbers.1"
              control={control}
              rules={
                {
                  // validate: (value, formValues) =>
                  //   PHONE_NUMBER_REGEX.test(value) ||
                  //   "Invalid phone number. Format: +254xxxxxxxxx",
                }
              }
              render={({ field: { value, onChange, ...field } }) => (
                <PhoneInput
                  country={"ke"}
                  onlyCountries={["ke"]}
                  // inputProps={{ required: true, autoFocus: true }} //	object	props to pass into the input eg  = {{ name: 'phone', required: true, autoFocus: true}}
                  value={value} //input state value
                  onChange={(phone) => onChange(`+${phone}`)} //onChange(value, country: { name, dialCode, countryCode (iso2) }, event, formattedValue)//value = phoneNumber without the '+'
                  countryCodeEditable={false}
                  inputStyle={{ height: 55, width: "100%" }}
                  containerStyle={{ height: 55 }}
                />
              )}
            />
            <Typography color="error.main" variant="caption">
              {errors.phoneNumbers?.[1]?.message}
            </Typography>
          </FormGroup>
        </Box>

        <Typography variant="h5" paragraph>
          Shipping address
        </Typography>

        <Box display="flex" justifyContent="space-between" columnGap={2}>
          <FormGroup sx={{ mb: 2, flexGrow: 1 }}>
            <TextField
              {...register("firstName", {
                required: "Title is required",
              })}
              label="First name"
              margin="dense"
              fullWidth
            />
            <Typography color="error.main" variant="caption">
              {errors.firstName?.message}
            </Typography>
          </FormGroup>

          <FormGroup sx={{ mb: 2, flexGrow: 1 }}>
            <TextField
              {...register("lastName", {
                required: "Title is required",
              })}
              label="Last name"
              margin="dense"
              fullWidth
            />
            <Typography color="error.main" variant="caption">
              {errors.lastName?.message}
            </Typography>
          </FormGroup>
        </Box>

        <FormGroup sx={{ mb: 2 }}>
          <TextField
            {...register("address", {
              required: "Address is required",
            })}
            label="Address"
            margin="dense"
          />
          <Typography color="error.main" variant="caption">
            {errors.address?.message}
          </Typography>
        </FormGroup>
        <Box display="flex" justifyContent="space-between" columnGap={2}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Country/region</InputLabel>
            <Select
              {...register("region", {
                required: "Region is required",
              })}
              label="Country/region"
              MenuProps={MenuProps}
            >
              {["Kenya"].map((region, i) => (
                <MenuItem key={i} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
            <Typography color="error.main" variant="caption">
              {errors.region?.message}
            </Typography>
          </FormControl>

          <Autocomplete
            // value={writerName}
            // onChange={(e, value) => setWriterName(value || "")} //catch select option value
            autoComplete // the portion of the selected suggestion that has not been typed by the user, appears inline after the input cursor in the textbox.//highlighted in blue
            autoHighlight //first option is highlighted
            loading //*important: If true, the component is in a loading state. This shows the loadingText in place of suggestions (only if there are no suggestions to show, e.g. options are empty i.e []).
            freeSolo //If true, the Autocomplete is free solo, meaning that the user input is not bound to provided options.
            loadingText={
              !City?.getCitiesOfCountry("KE") ? "Loading..." : "No city found"
            }
            disablePortal //the Popper content will be under the DOM hierarchy of the parent component.
            //size="small"
            options={
              City?.getCitiesOfCountry("KE")?.map((city) => city.name) ?? []
            }
            fullWidth
            //ListboxProps={{height:}}//use this prop to change maxHeight of the listbox
            renderInput={(params) => (
              <TextField
                {...register("city", {
                  required: "City is required",
                })}
                label="City"
                //params contains basic props passed to Autocomplete eg fullWidth, size disabled etc
                {...params}
                //placeholder="Filter by writer"
                //color="secondary"
                // value={writerName}
                // onChange={(e) => setWriterName(e.target.value)} //catch typed value if free solo
              />
            )}
          />
          <Typography color="error.main" variant="caption">
            {errors.city?.message}
          </Typography>
        </Box>

        <FormGroup sx={{ my: 2 }}>
          <TextField
            {...register("additionalInfo", {
              //required: "Description is required",
            })}
            label="Additional information"
            margin="dense"
            rows={3}
            multiline
            placeholder="eg Apartment, suite,  etc "
          />
          <Typography color="error.main" variant="caption">
            {errors.additionalInfo?.message}
          </Typography>
        </FormGroup>

        <Button
          variant="contained"
          disabled={false}
          endIcon={false && <CircularProgress size={20} color="inherit" />}
          onClick={handleTogglePwdD}
        >
          Save changes
        </Button>
      </Box>
    </Box>
  );
};

export default Address;
