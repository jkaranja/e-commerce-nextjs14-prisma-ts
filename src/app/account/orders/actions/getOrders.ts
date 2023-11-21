"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/app/config/prisma-client";
import { Order, Prisma, Product } from "@prisma/client";
import { getServerSession } from "next-auth";

interface QueryOptions {
  page: number;
  itemsPerPage?: number;
}
//Prisma queries do not include relations by default (you have to use the include option),
//the generated types do not include them either.
//for nested includes, use the same format used to include a relation in the query
export type OrderWithProducts = Prisma.OrderGetPayload<{
  include: { products: true };
}>;

export const getOrders = async (options: QueryOptions) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) throw new Error("Unauthorized");

    const orderById = session.user.id;

    /**----------------------------------
         * PAGINATION
  ------------------------------------*/
    //query string payload
    const page = options.page || 1; //current page no. / sent as string convert to number//page not sent use 1
    const itemsPerPage = options.itemsPerPage || 15; //items per page//if not sent from FE/ use default 15
    const skip = (page - 1) * itemsPerPage; //eg page = 5, it has already displayed 4 * 10//so skip prev items

    //this filter is different since its type is for counting only, no take or skip exists
    const filter: Prisma.OrderCountArgs = {
      where: {
        orderById, //filter by foreign key === primary key of user whom the notes belong to
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

    const total = await prisma.order.count(filter);

    //if total = 0 //error
    if (!total) {
      throw new Error("No products found");
    }

    const pages = Math.ceil(total / itemsPerPage);

    //in case invalid page is sent//out of range//not from the pages sent
    if (page > pages) {
      throw new Error("Page not found");
    }

    const orders = await prisma.order.findMany({
      where: {
        orderById, //filter by foreign key === primary key of user whom the notes belong to
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

      include: {
        products: true,
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
      orders: orders,
    };

    //redirect(`/post/${id}`) // Navigate to new route// redirect the user to a different route after the completion of a Server Action
  } catch (error: any) {
    //console.log(err);
    //re throw this errors so you can use try catch to get this error else this function will not throw any error and resolved value will either be products or error i.e in your next catch block, no error since error was already caught here

    //first check if err is a valid instance of error
    //1.using instanceof:
    //(error instanceof Error) === true|false//This won't work(return false) if error was thrown in a different window/frame/iframe than where the check is happening.
    //2.using duck-typing:
    //(myError.stack && myError.message)//However, this may produce false positives if you have non-error objects that contain stack and message properties
    throw new Error(
      error.stack && error.message ? error.message : "Request failed"
    );
    //err can be string or array for zod errors
  }
};
