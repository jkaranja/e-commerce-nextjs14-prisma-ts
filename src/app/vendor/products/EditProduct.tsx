import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Button,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";


const MEGA_BYTES_PER_BYTE = 1e6;
const convertBytesToMB = (bytes: number) =>
  Math.round(bytes / MEGA_BYTES_PER_BYTE);

type EditProductProps = {
  open: boolean;
  handleClose: () => void;
};

const EditProduct = ({ open, handleClose }: EditProductProps) => {
  const [selectedImages, setSelectedImages] = useState<any[]>([]);

  type Inputs = {
    files: FileList;
    bio: string;
    tourFee: number | string;
    phoneNumbers: { phone: string }[];
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      // phoneNumbers: profile.phoneNumbers.map((phone) => ({ phone })),//this here phone: undefined//use resetForm
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "phoneNumbers", // unique name for your Field Array
    }
  );

  const profilePic =
    watch("files")?.length && URL.createObjectURL(watch("files")[0]);

  const handlePicReset = () => {
    resetForm({ files: [] as unknown as FileList });
  };

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onSubmit = async (data: Inputs) => {
    const formData = new FormData();

    formData.append("profilePic", data.files?.[0]);
    formData.append("bio", data.bio);
    formData.append("tourFee", String(data.tourFee));
    formData.append(
      "phoneNumbers",
      JSON.stringify(data.phoneNumbers.map((pNumber) => pNumber.phone))
    );

    //await updateProfile(formData);
  };

  //set defaults
  //   useEffect(() => {
  //     resetForm({
  //       bio: profile?.bio || "",
  //       tourFee: profile?.tourFee || "",
  //       phoneNumbers: profile.phoneNumbers.map((phone) => ({ phone })),
  //     });
  //   }, [profile]);

  //feedback
  //   useEffect(() => {
  //     if (isError) toast.error(error as string);

  //     if (isSuccess) toast.success(data?.message);

  //     const timerId = setTimeout(() => {
  //       if (isSuccess) handleClose();
  //     }, 2000);

  //     return () => clearTimeout(timerId);
  //   }, [isError, isSuccess]);

  return (
    <Box>
      <Dialog
        fullWidth //works together with max width
        maxWidth="md" //default is small
        open={open}
        //onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Update product</Typography>

            <IconButton size="large" color="default" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("bio", {
                  required: "Bio is required",
                })}
                label="Product title"
                margin="dense"
              />
              <Typography color="error.main" variant="caption">
                {errors.bio?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("tourFee", {
                  required: "Tour fee is required",
                })}
                type="number"
                margin="dense"
                //size="small"
                // color="secondary"
                fullWidth
                //placeholder="0"
                //label=""
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Ksh</InputAdornment>
                  ),
                }}
              />
              <Typography color="error.main" variant="caption">
                {errors.bio?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("bio", {
                  required: "Bio is required",
                })}
                label="Brand"
                margin="dense"
              />
              <Typography color="error.main" variant="caption">
                {errors.bio?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("bio", {
                  required: "Bio is required",
                })}
                label="Select Category"
                margin="dense"
              />
              <Typography color="error.main" variant="caption">
                {errors.bio?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("bio", {
                  required: "Bio is required",
                })}
                label="Select tags"
                margin="dense"
              />

              {/* <option value="featured">Featured</option>
              <option value="popular">Popular</option>
              <option value="special">Special</option>
              //Best seller
              //Special offer
              
              */}
              <Typography color="error.main" variant="caption">
                {errors.bio?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("bio", {
                  required: "Bio is required",
                })}
                label="Select colors"
                margin="dense"
              />

              {/* <option value="featured">Featured</option>
              <option value="popular">Popular</option>
              <option value="special">Special</option>
              //Best seller
              //Special offer
              
              */}
              <Typography color="error.main" variant="caption">
                {errors.bio?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("bio", {
                  required: "Bio is required",
                })}
                label="Product Quantity"
                margin="dense"
                type="number"
              />

              {/* <option value="featured">Featured</option>
              <option value="popular">Popular</option>
              <option value="special">Special</option>
              //Best seller
              //Special offer
              
              */}
              <Typography color="error.main" variant="caption">
                {errors.bio?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ my: 2 }}>
              <TextField
                {...register("bio", {
                  required: "Bio is required",
                  // maxLength: {
                  //   value: 60,
                  //   message: "Exceeded ",
                  // },
                })}
                label="Product description"
                margin="dense"
                rows={4}
                multiline
                // placeholder="Example: "
              />
              <Typography color="error.main" variant="caption">
                {errors.bio?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("tourFee", {
                  required: "Tour fee is required",
                })}
                type="number"
                margin="dense"
                //size="small"
                // color="secondary"
                fullWidth
                //placeholder="0"
                //label=""
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Ksh</InputAdornment>
                  ),
                }}
              />
              <Typography color="error.main" variant="caption">
                {errors.tourFee?.message}
              </Typography>
            </FormGroup>

            <FormGroup>
              <FormLabel>
                Add styles
                <Typography
                  pl={0.5}
                  variant="caption"
                  color="muted.main"
                  component="span"
                >
                  (Phone numbers clients can use to reach you)
                </Typography>
                *
              </FormLabel>
              <Box textAlign="right" pb={2} pt={1}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => append({ phone: "" })}
                  variant="outlined"
                  size="small"
                >
                  Add
                </Button>
              </Box>

              {fields.map((item, index) => (
                <Box
                  key={item.id} // important to include key with field's id
                  display="flex"
                  columnGap={2}
                  alignItems="flex-start"
                  mb={1}
                >
                  <Typography variant="body2">Phone {index + 1}</Typography>
                  <Box flexGrow={1}>
                    <TextField
                      {...register(`phoneNumbers.${index}.phone` as const)}
                    />
                    <Typography color="error.main" variant="caption">
                      {errors.phoneNumbers?.[index]?.phone?.message}
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<RemoveIcon />}
                    onClick={() => remove(index)}
                    variant="outlined"
                    size="small"
                    color="error"
                    disabled={index === 0}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </FormGroup>

            <Typography>Add photos</Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 4 }}>
            <Button
              type="submit"
              variant="contained"
              //   disabled={isLoading}
              //   endIcon={
              //     isLoading && <CircularProgress size={20} color="inherit" />
              //   }
            >
              Save changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EditProduct;
