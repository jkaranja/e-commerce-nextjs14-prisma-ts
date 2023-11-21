import NextAuth from "next-auth/next";
import { authOptions } from "./authOptions";


//NOTE: you can't export anything else in route.ts other than HTTP methods else error when building app: 'property authOptions is incompatible with index signature ... 
//sol: define the authOptions in a diff file and import it here
//export const authOptions: NextAuthOptions = { }

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

