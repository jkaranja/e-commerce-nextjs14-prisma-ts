"use server";

import { v2 as cloudinary } from "cloudinary";
//global configs

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

/** ------------------DELETE IMAGE- working--------------////use it as a normal async function */
export const removeImage = async (publicId: string | undefined) => {
  try {
    if (!publicId) return;
    // Upload the image
    const result = await cloudinary.uploader.destroy(publicId);
    // console.log(result);
    return result;
  } catch (error) {
    return null;
    // console.error(error);
  }
};
