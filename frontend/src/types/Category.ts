export interface Category {
  id: number;
  category_name: string;
}

export interface Subcategory {
  id: number;
  subcategory_name: string;
  categoryId: number;
}

export const categoryTypes = ["women", "men", "kids"];

export type CategoryTypes = "women" | "men" | "kids";


export type Gender = "women" | "men" | "kids";