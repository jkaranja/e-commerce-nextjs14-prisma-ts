import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  FormLabel,
  IconButton,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { toast } from "react-toastify";

import { Product } from "@prisma/client";
import Image from "next/image";
import { IReviewForm, submitReview } from "../actions/submitReview";

type ReviewProductProps = {
  open: boolean;
  handleClose: () => void;
  product: Product;
};

const ReviewProduct = ({ open, handleClose, product }: ReviewProductProps) => {
  const [isPending, startTransition] = useTransition();

  const [hover, setHover] = useState(-1);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<IReviewForm>();

  //apply coupon discount
  const onSubmit = (data: IReviewForm) => {
    //get coupon discount
    startTransition(async () => {
      try {
        const result = await submitReview({ ...data, productId: product.id });
        toast.success(result.message);
        handleClose();
      } catch (error: any) {
        toast.error(error.message as string);
      }
    });
  };
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
            <Typography variant="h5">Review this product</Typography>

            <IconButton size="large" color="default" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form>
          <DialogContent>
            <Box display="flex" columnGap={2}>
              <Image
                src={product.images[0]?.url} //File or Fetched file url
                alt="product"
                loading="lazy"
                height={100}
                width={110}
                style={{ objectFit: "cover" }}
              />
              <Typography variant="h6">{product.title}</Typography>
            </Box>

            <FormGroup sx={{ mb: 2 }}>
              <FormLabel sx={{ py: 1 }}>Select stars to rate product</FormLabel>
              <Controller
                name="rating"
                control={control}
                rules={{
                  required: "Rating is required",
                }}
                render={({ field: { value, onChange, ...field } }) => (
                  <Box display="flex" alignItems="flex-end" gap={1}>
                    <Rating
                      name="simple-controlled"
                      value={value || 0}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      //Callback function that is fired when the hover state changes.
                      onChangeActive={(event, newHover) => {
                        setHover(newHover);
                      }}
                      size="large"
                      //max={5}//5 default
                      //size='small' | 'medium' | 'large'
                      //defaultValue={2.5}
                      precision={0.5} //Default 1//The minimum increment value change allowed.
                    />
                    <FormLabel>{hover !== -1 ? hover : value}</FormLabel>
                  </Box>
                )}
              />
              <Typography color="error.main" variant="caption">
                {errors.rating?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("comment", {
                  required: "Comment is required",
                })}
                label="Comment"
                margin="dense"
                rows={4}
                multiline
                // placeholder="Example: "
              />
              <Typography color="error.main" variant="caption">
                {errors.comment?.message}
              </Typography>
            </FormGroup>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 4 }}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
              endIcon={
                isPending && <CircularProgress size={20} color="inherit" />
              }
            >
              Submit review
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ReviewProduct;
