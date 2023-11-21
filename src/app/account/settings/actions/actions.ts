"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/app/config/prisma-client";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

export const getUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) throw new Error("Unauthorized");

    const id = session.user.id;

    const user = await prisma.user.findFirst({
      where: {
        id, //if id is undefined, it will return first match
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    throw new Error(
      error.stack && error.message ? error.message : "Request failed"
    );
  }
};
