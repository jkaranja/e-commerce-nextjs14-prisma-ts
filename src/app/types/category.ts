import { IImage } from "./image";

export interface ICategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  images: IImage[];
  description: string;
}
