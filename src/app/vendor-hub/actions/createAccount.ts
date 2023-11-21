"use server";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import prisma from "@/app/config/prisma-client";
import { EMAIL_REGEX, PWD_REGEX } from "@/app/constants/regex";
import { Role } from "@/app/types/user";

//key benefits of using Zod is that it helps improve the overall quality of the codebase by catching type mismatches and other data validation errors at compile-time.

//####### creating a schema for strings//see other primitives
//const mySchema = z.string();
//then use
//mySchema.parse("tuna"); // => "tuna"
//mySchema.parse(12); // => throws ZodError

//#######Creating an object schema
const schema = z.object({
  // primitive values->use these types(or array, object, tuple) to check type then validate further by appending type-specific validations(eg .max(5)) or transformations(eg .trim()) methods
  //tip, ctrl+ space for suggestions
  // z.string(),
  // z.number(),
  // z.bigint(),
  // z.boolean(),
  // z.date(),
  // z.symbol(),
  // username: z
  //   .string({
  //     required_error: "Name is required",
  //     invalid_type_error: "Name must be a string",
  //   })
  //   .min(5, { message: "Must be 5 or more characters long" }), //custom messages

  //email: z.string().email().regex(regex)
  // price: z.number(),
  // username: z.string().optional(), //see .partial() below
  email: z.string().email().regex(EMAIL_REGEX),
  password: z
    .string({ required_error: "Password is required" })
    .regex(PWD_REGEX, { message: "Spaces not allowed" })
    .min(6, { message: "Enter at least 6 characters" }),
  username: z.string(),
  roles: z.string().array(),
});
//append .partial(); to make all properties optional//or pass arg: { email: true,} to pick what to make optional
//append .required() to make all or some(give object arg) as required

//####### extract the inferred type like this
export type IRegisterForm = z.infer<typeof schema>;

//#######Creating an Arrays schema
//const stringArray = z.array(z.string());
// equivalent
//const stringArray = z.string().array();//
//examples usage
//z.string().optional().array(); // (string | undefined)[]
//z.string().array().optional(); // string[] | undefined
//const nonEmptyStrings = z.string().array().nonempty(); //array must contain at least one element
//z.string().array().min(5); // must contain 5 or more items
//z.string().array().max(5); // must contain 5 or fewer items
//z.string().array().length(5); // must contain 5 items exactly

//if using formState for errors, first arg must be prevState: any else first arg is formData
export const createAccount = async (prevState: any, data: IRegisterForm) => {
  //console.log(formData, prevState); //not since this is running on the server, this console is not visible in browser//check terminal

  try {
    //If the data is valid, the method will return a transformed and typed version of the data. If the data is invalid, it will throw an error
    const parsed = schema.parse({
      username: data.username,
      email: data.email,
      password: data.password,
      roles: data.roles,
    });

    const { email, username, password, roles } = parsed;
    // Check for duplicate email
    //match both lowercase and uppercase to ensure no same email is added in diff cases
    const duplicate = await prisma.user.findFirst({
      where: {
        email: {
          //if no mode, just pass email: "x@email"
          equals: email,
          mode: "insensitive", //collation//for pg and mongoDB only//others(mysql etc) use case-insensitive collation by default
        },
      },
    });

    if (duplicate) {
      throw new Error("Duplicate email");
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    ///user
    const userData = {
      username,
      password: hashedPwd,
      email,
      roles: roles as Role[],
    };

    const created = await prisma.user.create({
      data: {
        ...userData,

        //relation//we won't create a profile at first->for user friendly onboarding
        // profile: {
        //   create: {
        //     bio: "This is a sample bio",
        //     gender: "Male",
        //     address: "xx-4th street",
        //   }, //pass an array instead to create multiple eg  for 1-n
        // },
      },
    });

    return { message: "Registered!" };

    // await createItem(formData.get("todo"));

    //invalidate the Next.js Cache on demand. You can invalidate an entire route segment with revalidatePath:
    //return revalidatePath("/");
    //revalidatePath('/')

    //Or invalidate a specific data fetch with a cache tag using revalidateTag:
    //You can add tags to fetch as follows: fetch(url, { next: { tags: [...] } });
    //revalidateTag('posts')//tag must be added to a particular fetch

    //redirect(`/post/${id}`) // Navigate to new route// redirect the user to a different route after the completion of a Server Action
  } catch (e: any) {
    return { message: e.toString() };
  }
};
