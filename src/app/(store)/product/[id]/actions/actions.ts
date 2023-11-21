"use server";

import prisma from "@/app/config/prisma-client";
import { Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    reviews: {
      include: {
        user: true;
      };
    };
  };
}>;

export const getProduct = async (id: string) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id, //if id is undefined, it will return first match
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
        },
        //   brand: {
        //     select: {
        //       name: true,
        //       id: true,
        //     },
        //   },
        //   category: {
        //     select: {
        //       name: true,
        //       id: true,
        //     },
        //   },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error: any) {
    throw new Error(
      error.stack && error.message ? error.message : "Request failed"
    );
  }
};
