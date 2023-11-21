"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/app/config/prisma-client";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

interface QueryOptions {
  tag: string;
}

export const getProducts = async ({ tag }: QueryOptions) => {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session?.user) throw new Error("Unauthorized");

    // const userId = session.user.id;

    //this filter is different since its type is for counting only, no take or skip exists
    const filter: Prisma.ProductCountArgs = {
      where: {
        //userId, //filter by foreign key === primary key of user whom the notes belong to
        //title like %word% and case insensitive
        //  title: {
        //    contains: searchTerm,
        //    mode: "insensitive",
        //  },
        //  updatedAt: {
        //    gte: startDate, //start searching from the very beginning of our start date
        //    lte: endDate, //up to but not beyond the last minute of our endDate
        //  },
      },
    };

    const products = await prisma.product.findMany({
      where: {
        //userId, //filter by foreign key === primary key of user whom the notes belong to
        //title like %word% and case insensitive
        //   title: {
        //     contains: searchTerm,
        //     mode: "insensitive",
        //   },
        //   updatedAt: {
        //     gte: startDate, //start searching from the very beginning of our start date
        //     lte: endDate, //up to but not beyond the last minute of our endDate
        //   },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 8,
      //select fields & include CATS

      // select: {
      //   noteId: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   title: true,
      //   content: true,
      //   deadline: true,
      //   files: true,
      //   //can add _count here->returns number of categories per note
      //   _count: {
      //     select: { categories: true },
      //   },
      //     reviews: {
      //       include: {
      //         user: true,
      //       },
      //     },
      //   categories: {
      //     // orderBy: {
      //     //   name: "desc",
      //     // },
      //     //can also add a where here
      //     //        where: {
      //     // //         title: { contains: "omelette" },//can include relation filters here as well
      //     // //       },
      //     select: {
      //       name: true,
      //     },
      //   },
      //},
    });

    return products;

    //redirect(`/post/${id}`) // Navigate to new route// redirect the user to a different route after the completion of a Server Action
  } catch (err: any) {
    //console.log(err);
    //re throw this errors so you can use try catch to get this error else this function will not throw any error and resolved value will either be products or error i.e in your next catch block, no error since error was already caught here

    throw new Error(typeof err === "string" ? err : "Request failed");
    //err can be string or array for zod errors
  }
};
