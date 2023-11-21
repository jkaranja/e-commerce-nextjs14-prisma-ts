"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/app/config/prisma-client";
import { getServerSession } from "next-auth";
import { z } from "zod";

//#######Creating an object schema
const schema = z.object({
  comment: z.string(),
  rating: z.number(),
  productId: z.string(),
});

//####### extract the inferred type like this
export type IReviewForm = z.infer<typeof schema>;

export const submitReview = async (data: IReviewForm) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) throw new Error("Unauthorized");

    const userId = session.user.id;

    const productId = data.productId;

    const parsed = schema.parse(data);

    //create review & connect to user and product
    //could also have update product nd create review at the same time but we also have the use relation
    const review = await prisma.review.create({
      data: {
        comment: data.comment,
        rating: data.rating,

        //connect review to user: 1-1 relation
        user: {
          connect: { id: userId }, //stores or adds a foreign key/user id in orderById
        },

        //connect review to product: 1-1 relation
        product: {
          connect: { id: productId }, //stores or adds a foreign key/product id in productId
        },
      },
    });

    //re-calculate avg of this product rating
    const aggregations = await prisma.review.aggregate({
      //available number operations,_avg  _min (min value), _max//(max value), _sum, _count
      _avg: {
        rating: true,
      },
      //can also add filtering and ordering to return Ordered by age ascending, Where email contains prisma.io, Limited to the 10 users
      where: {
        productId,
      },
      //can also count fields whose avg is given-> returns:   {_avg: { age: 7},  _count: { age: 9 }}
      _count: {
        rating: true,
      },
    });

    //update product avg rating & review count
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(aggregations._avg.rating || 0),
        totalReviews: aggregations._count.rating,
      },
    });

    console.log(productId)

    return { message: "Review sent" };
  } catch (error: any) {
    throw new Error(
      error.stack && error.message ? error.message : "Request failed"
    );
  }
};
