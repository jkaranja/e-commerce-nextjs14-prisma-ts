import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  IconButton,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useState } from "react";

import { IImage } from "../types/image";
import { removeImage } from "../utils/cloudnary";

//reorder with react-beautiful-dnd
//https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/
//https://codesandbox.io/examples/package/react-beautiful-dnd //examples
//https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/types.md //types
//https://github.com/atlassian/react-beautiful-dnd/issues/2396 //fix issue due to strict mode

interface ImagesPreviewProps {
  selectedImages: IImage[];
  setSelectedImages: React.Dispatch<React.SetStateAction<IImage[]>>;
  //acceptedFiles: IImage[];
  // isLoading: boolean;
}

const ImagesPreview = ({
  selectedImages,
  setSelectedImages,
}: // acceptedFiles,
//isLoading,
ImagesPreviewProps) => {
  /* ----------------------
/REMOVE FILE FROM LIST
-------------------------*/
  const handleRemoveImage = (img: IImage) => {
    removeImage(img.publicId);//server action
    setSelectedImages((prev) => {
      return prev.filter((file, i) => file.url !== img.url);
    });
  };

  return (
    <ImageList
      sx={{
        maxHeight: 380,
        pb: 2,
      }}
      cols={4} //Default:2//Number of columns.
      rowHeight={110} //The height of one row in px.//Default:'auto'
      // variant="quilted" //use item cols&rows to span multiple row/cols//emphasize certain items over others in a collection.i.e give some images more cols
      //variant='standard'//Default
      gap={8} //Default:4//The gap between items in px.
    >
      {selectedImages.map((file, index) => {
        const cols = index % 2 ? 2 : 1;
        // const rows = item.featured ? 2 : 1;
        const url = file.url || "/";
        return (
          <ImageListItem
            key={`${url + index}`}
            // cols={cols}
            // rows={cols}
            // cols={cols}//can span multiple row->quilted//default: 1/Width of the item in number of grid columns.//if ImageList col=2, giving image col=2 will span whole row
            //rows={item.rows || 1}//can span multiple row->quilted////default: 1//Height of the item in number of grid rows.
          >
            <Box>
              <Image
                src={url} //File or Fetched file url
                alt="product"
                loading="lazy"
                height={110}
                width={500}
                style={{ objectFit: "cover" }}
              />
            </Box>

            <ImageListItemBar
              // title={
              //   <Typography
              //     component="span"
              //     // color="muted.dark"
              //     variant="body2"
              //   >
              //     {file.name.length > 32
              //           ? `${file.name.slice(0, 28).trim()}...${file?.name
              //               ?.split(".")
              //               .pop()}`
              //           : file.name}
              //   </Typography>
              // }
              //position="below"//The title bar can be placed below the image
              // subtitle={
              //   <Typography
              //     component="span"
              //     // color="muted.dark"
              //     variant="body2"
              //   >
              //     kb
              //   </Typography>
              // }
              actionIcon={
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 1)" }}
                  //onClick={() => handleRemoveImage(index)}
                  formAction={() => handleRemoveImage(file)}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        );
      })}

      {/* {acceptedFiles.length > 0 &&
        isLoading &&
        acceptedFiles.map((file, i) => (
          <ImageListItem key={`${file.name}` + i}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={110}
              width="100%"
              bgcolor="dull.main"
            >
              <CircularProgress color="inherit" />
            </Box>
          </ImageListItem>
        ))} */}
    </ImageList>
  );
};

export default ImagesPreview;
