import { IImage } from "../types/image";

//NOT WORKING
//cloudnary upload widget
const showUploadWidget = () => {
  const result = new Promise<IImage>((resolve, reject) => {
    //@ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_PRESET_NAME,
        // cropping: true, //add a cropping step
        // showAdvancedOptions: true,  //add advanced options (public_id and tag)
        // sources: [ "local", "url"], // restrict the upload sources to URL and local files
        // multiple: false,  //restrict upload to a single file
        folder: "product_images", //upload files to the specified folder
        // tags: ["users", "profile"], //add the given tags to the uploaded files
        // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
        // clientAllowedFormats: ["images"], //restrict uploading to image files only
        // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
        // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
        // theme: "purple", //change to a purple theme
      },

      (error: any, result: any) => {
        if (!error && result.event === "success") {
          resolve({ url: result.info.url, publicId: result.info.public_id });
        } else {
          resolve({ url: "", publicId: "" });
        }
      }
    );

    widget.open();
  });

  return result;
};

export default showUploadWidget;
