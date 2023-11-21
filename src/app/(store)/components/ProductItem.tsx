import calculateDiscount from "@/app/utils/calculateDiscount";
import {
  Box,
  CardActionArea,
  Rating,
  Typography
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product }: ProductItemProps) => {
  const router = useRouter();
  return (
    <Card key={product.id}>
      <CardActionArea onClick={() => router.push(`/product/${product.id}`)}>
        <CardMedia
          sx={{ height: 140 }}
          image={product.images[0]?.url}
          title={product.title}
        />

        <CardContent>
          <Typography gutterBottom>{product.title}</Typography>

          <Rating name="read-only" value={product.rating} readOnly />

          <Typography variant="subtitle1" gutterBottom>
            Ksh {product.discountedPrice}
          </Typography>
          <Box display="flex" columnGap={2}>
            <Typography sx={{ textDecoration: "line-through" }} paragraph>
              Ksh {product.price}
            </Typography>

            <Typography paragraph>
              ({calculateDiscount(product.price, product.discountedPrice)}% off)
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      {/* <CardActions disableSpacing></CardActions> */}
    </Card>
  );
};

export default ProductItem;
