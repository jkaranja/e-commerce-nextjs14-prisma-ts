"use server";

//import 'server-only' //if this was not a server action but a regular function supposed to run only in the backend
//ensure you include import 'server-only' to prevent the function from ever being called from a client component
//importing such function will throw a build-time error explaining that this module can only be used on the server

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import prisma from "@/app/config/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
//Next.js provides a powerful way to handle form submissions and data mutations using Server Actions
//With Server Actions, you don't need to manually create API endpoints. Instead, you define asynchronous server functions that can be called directly from your components.
//can use server action to perform mutations or fetch data from server(using fetch or directly from db)
//Server Actions can be defined in Server Components(no "use client" directive) or called from Client Components. Defining the action in a Server Component allows the form to function without JavaScript, providing progressive enhancement.
//Server Actions can be defined in two places:
//1.Inside the component that uses it (Server Components only).//define function/action(usually async) inline/inside the server component (not at the top)
//Server-only Forms: is when you define the Server Action in a Server Component.
//2.In a separate file (Client and Server Components), for reusability. You can define multiple Server Actions in a single file.
//if defining a server action function inside a component, that component must be a server component.
//add "use server" directive at the top of the server action/function. If in a diff file, add it at the top of the server actions file
//same case as fetching data(can fetch using fetch or directly from db)
//To define a fetch function in same file as the component, component must be a server component else
//define a server action in a diff file and can call that action from a client component
//In both cases, only a server component can be asynchronous

// You can invoke Server Actions using the following methods:

// Using action: React's action prop allows invoking a Server Action on a <form> element.
//->with action, first arg = formData: FormData and is called on a form action attr
//server action support progressive enhancement when defined inside a server component i.e allow form for work without js
// Using formAction: React's formAction prop allows handling <button>, <input type="submit">, and <input type="image"> elements in a <form>.
//->can be called on eg btn pass formAction attr to eg btn like  <btn formAction ={serverActionFunction} /> //to pass arg, can use inline callback to call serverAction(arg) with arg
// Custom Invocation with startTransition: Invoke Server Actions without using action or formAction by using startTransition.  This method disables Progressive Enhancement.
//const [isPending, startTransition] = useTransition()//using this hook mtd disables progressive enhancement
//eg <btn onClick={()=> startTransition(()=>updateTodo(todo))}
//startTransition Marks all state updates inside the async function as transitions
//This will be a callback function that updates some state by calling one or more set functions. React immediately calls scope(this cb) with no parameters and marks all state updates scheduled synchronously during the scope function call as transitions. They will be non-blocking and will not display unwanted loading indicators.
//startTransition does not return anything

//#fetch()
//Next.js extends the native fetch Web API to allow you to configure the caching and revalidating behavior for each fetch request on the server.
//React extends fetch to automatically memoize fetch requests while rendering a React component tree.
//You can use fetch with async/await in Server Components, in Route Handlers, and in Server Actions:
//1.Fetch in Server Action and call it from a client component: call the async function/server action normally in useEffect,
//but make sure this function is defined in a file with the "use server" directive at the top,
//otherwise, it will run on the browser exposing server side code("use server" make this run server side)
//2.async/await in Server Components: make the component async and define the fetcher function at the top of it->then call the fetcher inside the component ( await data)
// With this, don't put "use server" at the top of function.
//3. route handler: define the api under api folder an call it normally from frontend
//If using server to fetch data(either using fetch or directly) don't use useFormState and get the returned value of the server action or use it and get the value thru state
//
//eg:
// 'force-cache' is the default, and can be omitted
//fetch('https://...', { cache: 'force-cache' })
//fetch('https://...', { next: { revalidate: 3600 } })//revalidate data at a timed interval
//fetch('https://...', { next: { tags: ['collection'] } })//On-demand Revalidation
//the call revalidateTag('collection') in a server action
//fetch('https://...', { cache: 'no-store' })//opt out of caching for individual fetch requests i.e fetch data dynamically, on every request.

//#Error Handling
//data returned by or passed to the server action as arg must be a plain object (serializable objects)
//Will cause below error if not plain object:
//#Error Handling
//Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
//Above error thrown when trying to pass a File/FileList=> can't pass  File, FileList to server action->
//sol: stringify File,
//Also, zod errors are thrown as a single array. If you return eg {message: zodErr} in catch(accessed thru state), this will also cause error above
//sol is to return a plain object in both try & catch blocks. Can return a generic error for failed reqs

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
  title: z.string().min(8),
  price: z.number(),
  discountedPrice: z.number(),
  brand: z.string(),
  category: z.object({ cat: z.string(), subCat: z.string() }),
  styles: z.string().array(),
  colors: z.string().array(),
  sizes: z.string().array(),
  tags: z.string().array(),
  quantity: z.number(),
  locations: z.string().array(),
  description: z.string(),
  images: z
    .object({ url: z.string(), publicId: z.string() })
    .array()
    .optional(),
});
//append .partial(); to make all properties optional//or pass arg: { email: true,} to pick what to make optional
//append .required() to make all or some(give object arg) as required

//####### extract the inferred type like this
export type IProductForm = z.infer<typeof schema>;

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

//if using formState for errors, first arg must be prevState: any else first arg is formData(FormData if getting values from action)
export const addProduct = async (prevState: any, data: IProductForm) => {
  //console.log(formData, prevState); //not since this is running on the server, this console is not visible in browser//check terminal

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) return { message: "Unauthorized" };
    //console.log(session);

    //console.log(data);

    //If the data is valid, the method will return a transformed and typed version of the data. If the data is invalid, it will throw an error
    //zod error will be an array in this shape(not plain object (serializable objects)-> don't return as is):
    // [
    //   {
    //     code: "invalid_type",
    //     expected: "number",
    //     received: "string",
    //     path: ["price"],
    //     message: "Expected number, received string",
    //   },
    // ];

    //parsing formData if getting values from form directly using action attr(no r-hook)
    // const parsed = schema.parse({
    //   title: formData.get("title"),//retrieve field from formData: FormData
    // });
    //when this parse stringified File, it will be an array of empty objects
    const parsed = schema.parse(data);

    //create product
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        quantity: data.quantity,
        price: data.price,
        discountedPrice: data.discountedPrice,
        brand: data.brand,
        category: data.category,
        images: data.images,
        sizes: data.sizes,
        locations: data.locations,
        tags: data.tags,
        colors: data.colors,
        styles: data.styles,
        //connect product to user
        user: {
          connect: { id: session.user.id },
        },
      },
    });

    return { message: "Created!" };

    // await createItem(formData.get("todo"));

    //invalidate the Next.js Cache on demand. You can invalidate an entire route segment with revalidatePath:
    //return revalidatePath("/");
    //revalidatePath('/')

    //Or invalidate a specific data fetch with a cache tag using revalidateTag:
    //You can add tags to fetch as follows: fetch(url, { next: { tags: [...] } });
    //revalidateTag('posts')//tag must be added to a particular fetch

    //redirect(`/post/${id}`) // Navigate to new route// redirect the user to a different route after the completion of a Server Action
  } catch (err: any) {
    // return { message: typeof err === "string" ? err : "Request failed" };
    return { message: "Invalid inputs" }; //err can be string or array for zod errors
  }
};
