export interface IImage {
  url: string; //Fetched
  publicId: string; //Fetched
  // uri: string;//present in mobile //eg file:///data/user/0/com./filename.jpg //For mobile, File must contain uri, type and name
  // type?: string; //File
  //name?: string; //File
  // lastModified?: number; //File ////default Date.now()
  //*lastModifiedDate: Date; //File-> deprecated/could be present in file input element result in some browsers but not defined in File interface //eg Tue Nov 08 2022 20:16:47 GMT+0300 (East Africa Time)
  //webkitRelativePath?: string; //File//empty string
  //size?: number; //File + Fetched//in bytes
}
