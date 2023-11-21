import prisma from "@/app/config/prisma-client";
 
import { Role, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

//  https://next-auth.js.org/configuration/options

//next auth support Oauth provider(eg Google etc), magic link(sent to email, use click to sign ), and credentials(username, password)

//NextAuth.js has its own type definitions to use in your TypeScript projects safely.
//hover over options or ctrl click to view type definitions you can import
//for predefined types like Session and JWT, use Module Augmentation
//https://next-auth.js.org/getting-started/typescript#module-augmentation

//how user session is stored:
// The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
// If you use an `adapter` however, we default it to `"database"` instead.
// You can still force a JWT session by explicitly defining `"jwt"`.
// When using `"database"`, the session cookie will only contain a `sessionToken` value,
// which is used to look up the session in the database.

export const authOptions: NextAuthOptions = {
  //adapter: PrismaAdapter(prisma),//session user details will be stored in db and session cookie will only contain sessionToken value and the rest info will be fetched from db
  //for adapter: https://www.youtube.com/watch?v=PrdbyNYq-z4&list=LL&index=15&t=921s or https://authjs.dev/reference/adapter/prisma
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      //https://www.youtube.com/watch?v=ay-atEUGIc4 //dave gray Oauth and basic tut
      //https://www.youtube.com/watch?v=ay-atEUGIc4&t=1322s //RBAC authorization
      //https://next-auth.js.org/configuration/providers/oauth //use this for setup
      //https://authjs.dev/guides/basics/role-based-access-control //profile
      //https://next-auth.js.org/providers/github //individual providers setups
      //profile(profile: GitHubProfile){return {...profile, roles: []}},
      //callback in Oauth providers setup should be this format:
      //http://localhost:3000/api/auth/callback/twitter
      profile(profile) {
        return {
          // Return all the profile information you need.
          // The only truly required field is `id`
          // to be able identify the account when added to a database
          id: profile.id,
          //id: profile.id.toString(),
          ...profile,
          role: profile.role ?? "user",
          image: profile.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      //https://next-auth.js.org/configuration/providers/credentials
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "credentials",
      // The credentials is used to generate a suitable form on the sign in page.//here: http://localhost:3000/api/auth/signin  i.e [...nextauth] = dynamic/catch all subsequent segments
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      //see below how to pass a custom signIn page using pages property
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        username: {
          label: "Username",
          type: "text",
          placeholder: "John Smith",
        },
        role: { label: "role", type: "text", placeholder: "buyer" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user;
        // }
        // // Return null if user data could not be retrieved
        // return null;

        // check to see if email and password is there
        const email = credentials?.email;
        const password = credentials?.password;
        const role = credentials?.role as Role;

        if (!email || !password) {
          throw new Error("Please enter an email and password");
        }

        const foundUser = await prisma.user.findUnique({
          where: {
            email,
            roles: {
              has: role,
            },
          },
        });
        // console.log(role, email, password);
        //user null or user registered using Oauth= no pass
        if (!foundUser) {
          throw new Error("Wrong email or password");
        }

        const match = await bcrypt.compare(password, foundUser.password);

        if (!match) throw new Error("Wrong email or password");

        return foundUser;
      },
    }),
  ],
  //OTHER OPTIONS:
  //1. Callbacks are asynchronous functions you can use to control what happens when an action is performed.
  //Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database
  //eg:
  callbacks: {
    //Use the signIn() callback to control if a user is allowed to sign in
    async signIn({ user, account, profile, email, credentials }) {
      return true; //must return true to allow sign in req else return false to deny sign in and display a default error message
      //When using the Credentials Provider the user object is the response returned from the authorize callback and the profile object is the raw body of the HTTP POST submission.
      //When using NextAuth.js with a database, the User object will be either a user object from the database (including the User ID)
      //When using NextAuth.js without a database, the user object will always be a prototype user object, with information extracted from the profile.
      ////can register user here with Oauth info//console account/user/profile
    },
    async jwt({ token, account, profile, user }) {
      //This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client).
      //The user object here is the object that is returned from the authorize function i.e user object.
      //if using Oauth providers,user object is what is return by the profile function
      //use this callback to forward eg user details to session callback//

      //The user object that you return here will be accessed as token in the session callback to add to the session cookie.

      //*token(what is returned by jwt cb) is available in middleware withAuth callbacks. So can add role here and retrieve it in middleware.
      //this will be used to protect pages using RBAC on frontend. Can also use it to pass Oauth info to session callback then access it on client side

      //* Persist the OAuth access_token and or the user id to the token right after signin
      // if (account) {
      //   token.accessToken = account.access_token;
      //   // token.id = profile.id;
      //   token.role = "Admin"; //add custom fields like role
      // }

      //The jwt() callback is called with user when the user first logs in.
      //The user object will be populated with the object that is returned from the authorize function.
      //The object that is returned from the jwt callback is what will be saved on the session cookie.

      //here, we will return user
      //the default type of user here: {id: string, email: string, name: null|string, image: null|string}
      //see @types/next-auth-d.ts to merge User interface with custom type->module-augmentation

      if (typeof user !== "undefined") {
        // user has just signed in so the user object is populated
        //can also append values to token. eg token.id = "name" then return token
        return user;
      }

      return token;
    },

    async session({ session, token, user }) {
      //The session callback is called whenever a session is checked. Use it to send info to client i.e the session you access using useSession() or getServerSession()
      //token here is what is forwarded by jwt callback (eg our user object). add this to session

      //By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token (like access_token and user.id from above) via the jwt() callback, you have to explicitly forward it here to make it available to the client.

      // When using JSON Web Tokens the jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token using jwt() callback will be immediately available in the session callback, like for example an access_token or id from a provider.

      // Send properties to the client, like an access_token and user id from a provider. These will be available when you use useSession() on client side like data.accessToken
      // session.accessToken = token.accessToken;
      //session.user.id = token.id

      //can also modify token object here by adding user roles from db then get token in middleware then use conditions to check paths and redirect accordingly
      // session.role = token.role; //can also pass token.role= "admin" directly without adding it to token in jwt()

      //session type: {user: {email: string, name: null|string, image: null|string}, expires: string}
      //see @types/next-auth-d.ts to extend default types eg interface Session->module-augmentation
      //https://next-auth.js.org/getting-started/typescript#module-augmentation

      //add user from token(= object returned by jwt cb)
      session.user.id = token.id as string;
      session.user.roles = token.roles as Role[];
      session.user.email = token.email as string; //already existed
      session.user.username = token.username as string;

      return session;

      //The session() callback receives the session cookie content in its token parameter. Whatever is returned from this callback is what will be presented when useSession or getServerSession is called.
    },
  },
  //You can pass callbacks to perform some action like attach some info to session returned by useSession when  on eg signIn
  //see https://next-auth.js.org/configuration/callbacks
  //see also https://next-auth.js.org/getting-started/example#extensibility

  //2. custom pages
  //NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Sign out, Email Verification and displaying error messages.
  //ref: https://next-auth.js.org/configuration/pages
  ///To add a custom login page, you can use the pages option:
  //this pages need to actually exist in specified relative paths eg pages/auth/error.js
  //to use default pages, must not provide this pages options.
  //explicitly adding the default path eg /api/auth/signin won't work
  pages: {
    signIn: "/", //default "/api/auth/signin" //errors will be passed as error query parameters eg /auth/signin?error=Default, see others
    //this apply only when you are not using signIn() to handle sign in yourself but relying on the default signIn page
    signOut: "/", //default "/api/auth/signout"
    //it is still redirecting using the error page on signOut()
    error: "/", //default "/api/auth/error" Error code passed in query string as /auth/error?error=AccessDenied etc, see others
    //  verifyRequest: "/api/auth/verify-request", // (used for check email message)
    // newUser: "/api/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  //Must be
  secret: process.env.NEXTAUTH_SECRET, //for enc jwt//Required whether using db or jwt strategy as both use session cookie to identify current user session. Diff is the info stored in this cookie/token
  // //session.strategy= The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
  //no need to pass session option
  // session: {
  //   strategy: "jwt", //will store whole user session in session cookie
  // },

  //Set debug to true to enable debug messages for authentication and database operations.
  //It is meant for development only, to help you catch issues in your authentication flow and you should consider removing this option when deploying to production.
  debug: process.env.NODE_ENV !== "production",
};
