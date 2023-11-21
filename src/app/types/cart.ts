import { Product } from "@prisma/client";
import { IProduct } from "./product";

export interface IItem {
  id: string;
  product: Product;
  units: number;
  color: string;
  style: string;
  size: string;
  location: string;
}
