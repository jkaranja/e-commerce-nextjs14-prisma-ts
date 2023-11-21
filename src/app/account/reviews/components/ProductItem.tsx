import formattedDate from "@/app/utils/formattedDate";
import {
  Box,
  Button,
  ListItem,
  Typography
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReviewProduct from "./ReviewProduct";

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product }: ProductItemProps) => {
  //dialogs
  const [openReviewD, setOpenReviewD] = useState(false);
  const handleToggleReviewD = () => setOpenReviewD((prev) => !prev);

  const router = useRouter();

  return (
    <Box>
      {openReviewD && (
        <ReviewProduct
          open={openReviewD}
          handleClose={handleToggleReviewD}
          product={product}
        />
      )}
      <ListItem
        divider
        //disablePadding
        // sx={{
        //   bgcolor: pathname.startsWith(`/vendor/${link}`)
        //     ? "rgba(231, 227, 252, 0.08)"
        //     : "",
        // }}
        secondaryAction={
          <Button onClick={() => handleToggleReviewD()}>
            Rate this product
          </Button>
        }
      >
        <Image
          //src={product.images[0]?.url} //File or Fetched file url
          src="/banner.jpg"
          alt="product"
          loading="lazy"
          height={100}
          width={110}
          style={{ objectFit: "cover" }}
        />

        <ListItemText
          primary={
            <Typography
              px={2}
              variant="h6"
              component={Link}
              href={`/product/${product.id}`}
            >
              {product.title}
            </Typography>
          }
          secondary={
            <Box px={2}>
              <Typography color="muted.main" paragraph>
                ID #{product.id.slice(-7)}
              </Typography>

              <Typography color="muted.main">Qty {3}</Typography>

              <Typography color="muted.main" variant="subtitle2">
                {formattedDate(new Date(product.updatedAt))}
              </Typography>
            </Box>
          }
          secondaryTypographyProps={
            {
              // sx: { color: "rgba(231, 227, 252)" },
            }
          }
        />
      </ListItem>
    </Box>
  );
};

export default ProductItem;
