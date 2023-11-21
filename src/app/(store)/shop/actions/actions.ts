"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/app/config/prisma-client";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { IFilter } from "../components/Filters";

interface QueryOptions {
  page: number;
  itemsPerPage?: number;
  filters: IFilter;
}

export const getProducts = async (options: QueryOptions) => {
  try {
    /**----------------------------------
         * PAGINATION
  ------------------------------------*/
    //query string payload
    const page = options.page || 1; //current page no. / sent as string convert to number//page not sent use 1
    const itemsPerPage = options.itemsPerPage || 15; //items per page//if not sent from FE/ use default 15
    const skip = (page - 1) * itemsPerPage; //eg page = 5, it has already displayed 4 * 10//so skip prev items
    const filters = options.filters;
    //this filter is different since its type is for counting only, no take or skip exists
    const filter: Prisma.ProductCountArgs = {
      where: {
        //title like %word% and case insensitive// empty string matches all
        title: {
          contains: filters.title,
          mode: "insensitive",
        },
        // tags: {
        //   ...(filters.tag
        //     ? { has: filters.tag }
        //     : {
        //         isEmpty: false,
        //       }),
        // },
        // price: {
        //   gte: filters.priceRange[0],
        //   lte: filters.priceRange[1],
        // },
        // colors: {
        //   ...(filters.color
        //     ? { has: filters.color }
        //     : {
        //         isEmpty: false,
        //       }),
        // },

        // rating: {
        //   gte: filters.rating || 0,
        //   lte: filters.rating || 5,
        // },
        // category: {
        //   is: {
        //     cat: {
        //       contains: filters.cat,
        //       mode: "insensitive",
        //     },
        //     subCat: {
        //       contains: filters.subCat,
        //       mode: "insensitive",
        //     },
        //   },
        // },

        //  updatedAt: {
        //    gte: startDate, //start searching from the very beginning of our start date
        //    lte: endDate, //up to but not beyond the last minute of our endDate
        //  },
      },
    };

    const total = await prisma.product.count(filter);

    //if total = 0 //error
    if (!total) {
      throw new Error("No products found");
    }

    const pages = Math.ceil(total / itemsPerPage);

    //in case invalid page is sent//out of range//not from the pages sent
    if (page > pages) {
      throw new Error("Page not found");
    }

    const products = await prisma.product.findMany({
      where: {
        // userId, //filter by foreign key === primary key of user whom the notes belong to
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

      skip,
      take: itemsPerPage, //limit in mongoose
    });

    return {
      pages,
      total,
      products,
    };

    //redirect(`/post/${id}`) // Navigate to new route// redirect the user to a different route after the completion of a Server Action
  } catch (err: any) {
    //console.log(err);
    //re throw this errors so you can use try catch to get this error else this function will not throw any error and resolved value will either be products or error i.e in your next catch block, no error since error was already caught here

    throw new Error(typeof err === "string" ? err : "Request failed");
    //err can be string or array for zod errors
  }
};
