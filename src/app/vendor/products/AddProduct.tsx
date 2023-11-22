import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { toast } from "react-toastify";

import SubmitButton from "@/app/components/SubmitButton";
import { useFormState } from "react-dom";
import { IProductForm, addProduct } from "./actions/addProduct";

import ImagesPreview from "@/app/components/ImagesPreview";
import CATEGORIES from "@/app/constants/categories";
import { IImage } from "@/app/types/image";
import { useSession } from "next-auth/react";

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

//must be Object type below or void
//The value you want the state to be initially. It can be any serializable value. This argument is ignored after the action is first invoked.
const initialState = {
  message: "", //must be a string
};

type AddProductProps = {
  open: boolean;
  handleClose: () => void;
};

const AddProduct = ({ open, handleClose }: AddProductProps) => {
  const [images, setImages] = useState<IImage[]>([]);

  const { data: session, status, update } = useSession();

  //useFormState is a Hook that allows you to update state based on the result of a form action.
  //https://react.dev/reference/react-dom/hooks/useFormState
  const [state, formAction] = useFormState(addProduct, initialState);

  const [arrayFields, setArrayFields] = useState({
    colors: [],
    sizes: [],
    styles: [],
    tags: [],
    locations: [],
  });

  const handleSelectChange = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value, name },
    } = e;

    setArrayFields((prev) => ({
      ...prev,
      // On autofill we get a stringified value.
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
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
  } = useForm<IProductForm>({
    defaultValues: {
      title: "",
      //marketPrice: 0,
      //discountedPrice: 0,
      //brand: "",
      //category: { cat: "", subCat: "" },
      //styles: [""],
      //colors: [""],
      //sizes: [""],
      // quantity: 0,
      //tags: [""],
      description: "",
    },
  });

  const onSubmit: SubmitHandler<IProductForm> = async (data) => {
    //Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
    //Above error thrown when trying to pass a File/FileList=> can't pass  File, FileList
    //Since data is being sent to server over network, File object must be sent as FormData
    //You can append all inputs and send data as formData and then get fields like formData.get("files")
    //or formData.get("title") or pass it thru zod parse
    //is you stringify the File and send it to server, field will have array of empty objects,
    //sol: send data as formData to upload file on the server(server action) or upload it from frontend
    //for cloudnary widget, don't forget to load cloudnary script in the layout

    const {
      brand,
      quantity,
      category,
      price,
      discountedPrice,
      title,
      description,
    } = data;

    formAction({
      images,
      ...arrayFields,
      brand,
      quantity: quantity || 0,
      category,
      price: price || 0,
      discountedPrice: discountedPrice || 0,
      title,
      description,
    });
  };

  //feedback
  useEffect(() => {
    if (state.message) toast.info(state.message as string);
  }, [state]); //state ref won't change, check length

  //upload widget
  function showUploadWidget() {
    //@ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_PRESET_NAME,
        // cropping: true, //add a cropping step
        // showAdvancedOptions: true,  //add advanced options (public_id and tag)
        // sources: [ "local", "url"], // restrict the upload sources to URL and local files
        // multiple: false,  //restrict upload to a single file
        folder: "product_images", //upload files to the specified folder
        // tags: ["users", "profile"], //add the given tags to the uploaded files
        // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
        // clientAllowedFormats: ["images"], //restrict uploading to image files only
        // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
        // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
        // theme: "purple", //change to a purple theme
      },

      (error: any, result: any) => {
        if (!error && result.event === "success") {
          //add img to images state
          setImages((prev) => [
            ...prev,
            { url: result.info.url, publicId: result.info.public_id },
          ]);
        }
      }
    );
    widget.open();
  }

  return (
    <Box>
      <Dialog
        fullWidth //works together with max width
        maxWidth="lg" //default is small
        open={open}
        //onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">
              Add new product {state?.message}
            </Typography>

            <IconButton size="large" color="default" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form action={(formData: FormData) => handleSubmit(onSubmit)()}>
          <DialogContent sx={{ minHeight: "97vh" }}>
            <Grid2
              container
              justifyContent="space-between"
              rowSpacing={2}
              columnGap={4}
              flexDirection={{ xs: "column", md: "row" }}
            >
              <Grid2 xs container flexDirection="column" rowGap={1}>
                <FormGroup sx={{ mb: 2 }}>
                  <TextField
                    {...register("title", {
                      // required: "Title is required",
                    })}
                    label="Product title"
                    margin="dense"
                  />
                  <Typography color="error.main" variant="caption">
                    {errors.title?.message}
                  </Typography>
                </FormGroup>

                <FormGroup sx={{ mb: 2 }}>
                  <TextField
                    {...register("price", {
                      //required: "Market price is required",
                      setValueAs: (v) => parseInt(v),
                    })}
                    type="number"
                    margin="dense"
                    //size="small"
                    // color="secondary"
                    fullWidth
                    //placeholder="0"
                    label="Market Price (Ksh)"
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">Ksh</InputAdornment>
                    //   ),
                    // }}
                  />
                  <Typography color="error.main" variant="caption">
                    {errors.price?.message}
                  </Typography>
                </FormGroup>

                <FormGroup sx={{ mb: 2 }}>
                  <TextField
                    {...register("discountedPrice", {
                      //required: "Discounted price is required",
                      setValueAs: (v) => parseInt(v),
                    })}
                    type="number"
                    margin="dense"
                    fullWidth
                    label="Price after Discount"
                  />
                  <Typography color="error.main" variant="caption">
                    {errors.discountedPrice?.message}
                  </Typography>
                </FormGroup>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select brand</InputLabel>
                  <Select
                    {...register("brand", {
                      //required: "Brand is required",
                    })}
                    label="Select brand"
                    MenuProps={MenuProps}
                  >
                    {[
                      "Generic",
                      "Gucci",
                      "Prada",
                      "Nike",
                      "H&M",
                      "Louis Vuitton",
                    ].map((brand, i) => (
                      <MenuItem key={i} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography color="error.main" variant="caption">
                    {errors.brand?.message}
                  </Typography>
                </FormControl>

                <Box display="flex" columnGap={3}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Category</InputLabel>
                    <Select
                      {...register("category.cat", {
                        // required: "Category is required",
                      })}
                      label="Select Category"
                      MenuProps={MenuProps}
                    >
                      {CATEGORIES.map((category, i) => (
                        <MenuItem key={i} value={category.cat}>
                          {category.cat}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography color="error.main" variant="caption">
                      {errors.category?.cat?.message}
                    </Typography>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Sub category</InputLabel>
                    <Select
                      {...register("category.subCat", {
                        //required: "Sub category is required",
                      })}
                      label="Select Category"
                      MenuProps={MenuProps}
                    >
                      {(
                        Object.values(
                          CATEGORIES.find(
                            (category) => category.cat === watch("category.cat")
                          ) || {}
                        )[1] as Array<string>
                      )?.map((subCat, i) => (
                        <MenuItem key={i} value={subCat}>
                          {subCat}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography color="error.main" variant="caption">
                      {errors.category?.subCat?.message}
                    </Typography>
                  </FormControl>
                </Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select styles</InputLabel>
                  <Select
                    name="styles"
                    value={arrayFields.styles}
                    onChange={handleSelectChange}
                    multiple
                    label="Select styles"
                    renderValue={(selected: string[]) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {[
                      "Classic T-Shirts",
                      "Premium T-shirts",
                      "V-Neck",
                      "Long Sleeve",
                      "Hoodie",
                      "Sweatshirt",
                      "Tank Top",
                    ].map((style, i) => (
                      <MenuItem key={i} value={style}>
                        {style}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography color="error.main" variant="caption">
                    {errors.styles?.message}
                  </Typography>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select colors</InputLabel>
                  <Select
                    name="colors"
                    value={arrayFields.colors}
                    onChange={handleSelectChange}
                    label="Select colors"
                    multiple
                    renderValue={(selected: string[]) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected?.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            sx={{ bgcolor: value }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {["Blue", "Yellow", "Red", "Brown", "Gray"].map(
                      (color, i) => (
                        <MenuItem key={i} value={color}>
                          {color}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <Typography color="error.main" variant="caption">
                    {errors.colors?.message}
                  </Typography>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select sizes</InputLabel>
                  <Select
                    name="sizes"
                    value={arrayFields.sizes}
                    onChange={handleSelectChange}
                    multiple
                    label="Select sizes"
                    renderValue={(selected: string[]) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {["S", "M", "L", "XL", "2XL", "3XL"].map((size, i) => (
                      <MenuItem key={i} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography color="error.main" variant="caption">
                    {errors.sizes?.message}
                  </Typography>
                </FormControl>

                <FormGroup sx={{ mb: 2 }}>
                  <TextField
                    {...register("quantity", {
                      // required: "Quantity is required",
                      setValueAs: (v) => parseInt(v),
                    })}
                    label="Product Quantity"
                    margin="dense"
                    type="number"
                  />
                  <Typography color="error.main" variant="caption">
                    {errors.quantity?.message}
                  </Typography>
                </FormGroup>
              </Grid2>

              <Grid2 xs container flexDirection="column" rowGap={1}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Print locations</InputLabel>
                  <Select
                    name="locations"
                    value={arrayFields.locations}
                    onChange={handleSelectChange}
                    multiple
                    label="Print locations"
                    renderValue={(selected: string[]) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {["Front(default)", "Back", "Both sides", "Left chest"].map(
                      (location, i) => (
                        <MenuItem key={i} value={location}>
                          {location}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <Typography color="error.main" variant="caption">
                    {errors.locations?.message}
                  </Typography>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select tags</InputLabel>
                  <Select
                    name="tags"
                    value={arrayFields.tags}
                    onChange={handleSelectChange}
                    multiple
                    label="Select tags"
                    renderValue={(selected: string[]) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {[
                      "Featured",
                      "Popular",
                      "Special offer",
                      "Best seller",
                      "Black Friday deal",
                      "Limited Edition",
                    ].map((tag, i) => (
                      <MenuItem key={i} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography color="error.main" variant="caption">
                    {errors.tags?.message}
                  </Typography>
                </FormControl>

                <FormGroup sx={{ mb: 2 }}>
                  <TextField
                    {...register("description", {
                      // required: "Description is required",
                    })}
                    label="Product description"
                    margin="dense"
                    rows={4}
                    multiline
                    // placeholder="Example: "
                  />
                  <Typography color="error.main" variant="caption">
                    {errors.description?.message}
                  </Typography>
                </FormGroup>

                <Typography>Add photos</Typography>
                <Button type="button" onClick={showUploadWidget}>
                  Upload Images
                </Button>

                <ImagesPreview
                  selectedImages={images}
                  setSelectedImages={setImages}
                />
              </Grid2>
            </Grid2>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 4 }}>
            <SubmitButton variant="contained">Submit </SubmitButton>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AddProduct;
