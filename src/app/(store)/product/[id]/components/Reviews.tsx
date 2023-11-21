"use client";

import formattedDate from "@/app/utils/formattedDate";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Rating,
  Typography
} from "@mui/material";
import { ProductWithRelations } from "../actions/actions";

type ReviewsProps = {
  product: ProductWithRelations;
};

const Reviews = ({ product }: ReviewsProps) => {
  return (
    <Box id="reviews">
      <Typography variant="h6" paragraph>
        Product reviews
      </Typography>

      <Typography variant="h6" paragraph>
       {!product.reviews?.length && "No reviews yet"}
      </Typography>

      {product.reviews?.map((review) => (
        <Box key={review.id}>
          <Card variant="elevation" elevation={0}>
            <CardContent>
              <Box mb={1}>
                <Rating name="read-only" value={review.rating} readOnly />
              </Box>

              <Typography variant="subtitle1">{`${review.comment} `}</Typography>
            </CardContent>

            <CardHeader
              avatar={<Avatar src="/" alt={review.user.username} />}
              title={
                <Typography variant="subtitle1">
                  {review.user.username}
                </Typography>
              }
              subheader={
                <Typography variant="body2">
                  {formattedDate(new Date(review.updatedAt))}
                </Typography>
              }
            />
          </Card>
          <Divider />
        </Box>
      ))}
    </Box>
  );
};

export default Reviews;
