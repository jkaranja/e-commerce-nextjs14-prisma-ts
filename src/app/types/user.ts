export enum Role {
  Admin = "ADMIN",
  Buyer = "BUYER",
  Vendor = "VENDOR",
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePic: any; //or {}, Schema.Types.Mixed, mongoose.Mixed, = { url: string; publicId: string }
  roles: Role[];
}
