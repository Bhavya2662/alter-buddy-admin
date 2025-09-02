import { ICategoryProps } from "./mentor.interface";

export interface IPackagesProps {
  categoryId: string | ICategoryProps;
  packageType: "video" | "audio" | "chat";
  packageName: string;
  description?: string;
  price: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}
