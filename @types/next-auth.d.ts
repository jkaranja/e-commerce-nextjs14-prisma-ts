 
import { Role } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

// https:next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  //session interface will be merged(replaced if type already exist)
  interface Session {
    //type for session.type in session cb
    //DefaultSession["user"] object type: {user: {email: string, name: null|string, image: null|string}
    user: {
      /** The user's postal address. */
      roles: Role[];
      id: string;
      username: string;
    } & DefaultSession["user"];
  }

  //type for user in jwt cb
  //default: interface User extends DefaultUser{}
  //DefaultUser = {id: string, email: string, name: null|string, image: null|string}
  //merge user //can extend DefaultUser
  interface User extends Record<string, any> {
    //roles: Role[];
  }
}

//type for token if appending values in jwt cb or using token.roles in middleware
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
     roles?: Role[];
  }
}
