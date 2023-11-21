"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import prisma from "@/app/config/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { IOrder } from "@/app/types/order";
import { Item, PaymentStatus } from "@prisma/client";

export const placeOrder = async (order: IOrder) => { 
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) throw new Error("Unauthorized");

    const userId = session.user.id;

    //use the paymentInfo object to process payment here eg send prompt if using m-pesa or process card payment
    //proceed to save order. When payment is complete, have a callback that receives pyment details and update the payment info field in db

    //create order
    const result = await prisma.order.create({
      data: {
        items: order.items.map((item) => {
          //exclude product from save items list
          const { product, ...options } = item;
          return options;
        }),
        address: order.address,
        subTotal: order.subTotal,
        shipping: order.shipping,
        discount: order.discount,
        total: order.total, //subtotal + shipping(-minus coupon discount)

        //connect order to user: 1-1 relation
        orderBy: {
          connect: { id: userId }, //stores or adds a foreign key/user id in orderById
        },
        //1-n relation
        //connect multiple products(via id) to this order i.e add order id in every product below
        ////stores or adds a foreign key/user id in orderById
        products: {
          connect: order.items.map((item) => ({ id: item.id })),
        },
      },
    });

    return result;

    //redirect(`/account/orders`); // Navigate to new route// redirect the user to a different route after the completion of a Server Action
  } catch (error: any) {
    throw new Error(
      error.stack && error.message ? error.message : "Request failed"
    );
  }
};

//fetch coupon
export const getCoupon = async (code: string) => {
  try {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code,
      },
      select: {
        expiry: true,
        discount: true,
      },
    });

    if (!coupon) {
      throw new Error("Coupon is Invalid");
    }

    //check if coupon has expired
    if (new Date(coupon.expiry).getTime() < Date.now()) {
      throw new Error("Coupon has expired");
    }

    return coupon;
  } catch (error: any) {
    throw new Error(
      error.stack && error.message ? error.message : "Request failed"
    );
  }
};
