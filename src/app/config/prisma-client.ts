
// import { PrismaClient } from "@prisma/client";


// const prisma = new PrismaClient({
//   //log: ["query", "info", "warn", "error"],
// }); 

// //Prisma supports two types of logging:
// // Logging to stdout (default) //above in prisma client instance
// // Event-based logging (use $on()  method to subscribe to events) //below
// // prisma.$on("query", (e) => {
// //   console.log("Query: " + e.query);
// //   console.log("Params: " + e.params);
// //   console.log("Duration: " + e.duration + "ms");
// // });
// //https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging

// export default prisma

//below solve warning: This is the 10th instance of prisma client being started. Make sure this is intentional
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;