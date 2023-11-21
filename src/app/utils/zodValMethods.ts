
// import { z } from "zod";

// // https://www.npmjs.com/package/zod



// // supported primitive values
// z.string();
// z.number();
// z.bigint();
// z.boolean();
// z.date();
// z.symbol();

// // empty types
// z.undefined();
// z.null();
// z.void(); // accepts undefined

// // catch-all types
// // allows any value
// z.any();
// z.unknown();

// // never type
// // allows no values
// z.never();

// //###Strings;

// //Zod includes a handful of string-specific validations.
// // validations
// z.string().max(5);
// z.string().min(5);
// z.string().length(5);
// z.string().email();
// z.string().url();
// z.string().emoji();
// z.string().uuid();
// z.string().cuid();
// z.string().cuid2();
// z.string().ulid();
// z.string().regex(regex);
// z.string().includes(string);
// z.string().startsWith(string);
// z.string().endsWith(string);
// z.string().datetime(); // ISO 8601; default is without UTC offset, see below for options
// z.string().ip(); // defaults to IPv4 and IPv6, see below for options

// // transformations
// z.string().trim(); // trim whitespace
// z.string().toLowerCase(); // toLowerCase
// z.string().toUpperCase(); // toUpperCase

// //You can customize some common error messages when creating a string schema.

// const name = z.string({
//   required_error: "Name is required",
//   invalid_type_error: "Name must be a string",
// });



// //When using validation methods, you can pass in an additional argument to provide a custom error message.

// z.string().min(5, { message: "Must be 5 or more characters long" });
// z.string().max(5, { message: "Must be 5 or fewer characters long" });






// //#####3Numbers
// //You can customize certain error messages when creating a number schema.

// const age = z.number({
//   required_error: "Age is required",
//   invalid_type_error: "Age must be a number",
// });
// //#Optionally, you can pass in a second argument to provide a custom error message.
// z.number().lte(5, { message: "this👏is👏too👏big" });

// //#Zod includes a handful of number-specific validations.

// z.number().gt(5);
// z.number().gte(5); // alias .min(5)
// z.number().lt(5);
// z.number().lte(5); // alias .max(5)

// z.number().int(); // value must be an integer

// z.number().positive(); //     > 0
// z.number().nonnegative(); //  >= 0
// z.number().negative(); //     < 0
// z.number().nonpositive(); //  <= 0

// z.number().multipleOf(5); // Evenly divisible by 5. Alias .step(5)

// z.number().finite(); // value must be finite, not Infinity or -Infinity
// z.number().safe(); // value must be between Number.MIN_S



// //####### ARRAY
// //#######Creating an Arrays schema
// const stringArray1 = z.array(z.string());
// // equivalent
// const stringArray2 = z.string().array();//
// z.string().optional().array(); // (string | undefined)[]
// z.string().array().optional(); // string[] | undefined
// const nonEmptyStrings = z.string().array().nonempty(); //array must contain at least one element
// z.string().array().min(5); // must contain 5 or more items
// z.string().array().max(5); // must contain 5 or fewer items
// z.string().array().length(5); // must contain 5 items exactly



// //###optional
// //You can make any schema optional with z.optional().
// //eg
// z.string().optional()
// //equivalent to:
// const schema = z.optional(z.string());

// //For convenience, call the .optional() method on an existing schema
// z.string().optional().array(); // (string | undefined)[]
// z.string().array().optional(); // string[] | undefined


// //#Unions
// //Zod includes a built-in z.union method for composing "OR" types.

// const stringOrNumberw = z.union([z.string(), z.number()]);

// stringOrNumberw.parse("foo"); // passes
// stringOrNumberw.parse(14); // passes
// //Zod will test the input against each of the "options" in order and return the first value that validates successfully.

// //For convenience, you can also use the .or method:

// const stringOrNumber = z.string().or(z.number());

// //#others
// NaNs
// You can customize certain error messages when creating a nan schema.

// const isNaN = z.nan({
//   required_error: "isNaN is required",
//   invalid_type_error: "isNaN must be not a number",
// });

// Booleans
// You can customize certain error messages when creating a boolean schema.

// const isActive = z.boolean({
//   required_error: "isActive is required",
//   invalid_type_error: "isActive must be a boolean",
// });


// Dates
// Use z.date() to validate Date instances.

// z.date().safeParse(new Date()); // success: true
// z.date().safeParse("2022-01-12T00:00:00.000Z"); // success: false
// You can customize certain error messages when creating a date schema.

// const myDateSchema = z.date({
//   required_error: "Please select a date and time",
//   invalid_type_error: "That's not a date!",
// });
// Zod provides a handful of date-specific validations.

// z.date().min(new Date("1900-01-01"), { message: "Too old" });
// z.date().max(new Date(), { message: "Too young!" });


// Nullables
// Similarly, you can create nullable types with z.nullable().

// const nullableString = z.nullable(z.string());
// nullableString.parse("asdf"); // => "asdf"
// nullableString.parse(null); // => null
// Or use the .nullable() method.

// const E = z.string().nullable(); // equivalent to nullableString



// Objects
// // all properties are required by default
// const Dog = z.object({
//   name: z.string(),
//   age: z.number(),
// });