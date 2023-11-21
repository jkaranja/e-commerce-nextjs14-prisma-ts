import { IImage } from "./image";
import { IUser } from "./user";

export interface IProduct {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  tags: string[];
  images: IImage[];
  price: number;
  discountedPrice: number;
  quantity: number; //initial units
  sold: number; //units sold

  sizes: string[];
  colors: string[];

  brand: string;
  category: { cat: string; subCat: string };
  //reviews: { id: string; review: string; rating: number; user: IUser }[];
  qty?: number; //number of units to buy
}
