import type { Color } from "./Color";
import type { Size } from "./Size";
import type { Category, Subcategory, Gender } from "./Category";

export interface Product {
  id: number;
  title: string;
  category: Category;
  subcategory: Subcategory;
  description: string;
  gender: Gender;
  stock: {
    color: Color;
    size: Size;
    available: number;
  }[];
  price: number;
  images: string[];
}
