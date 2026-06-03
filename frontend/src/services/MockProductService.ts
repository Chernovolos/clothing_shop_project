import type { Product } from "@/types/Product.ts";
import type { CategoryTypes, Gender } from "@/types/Category.ts";
import { product_categories, products_for_kids, products_for_man, products_for_woman } from "@/mocks/products.ts";

export default class MockProductService {
  public static async getProductById({gender, id}: {gender: Gender, id: string}) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const dataMap: Record<CategoryTypes, Product[]> = {
      women: products_for_woman,
      men: products_for_man,
      kids: products_for_kids,
    }

    const products = dataMap[gender];

    const product = products.find((item) => {
      return item.id === +id;
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;

  };
  public static async getCategories() {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return product_categories;
  };
  public static async getProducts(category: CategoryTypes) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const dataMap: Record<CategoryTypes, Product[]> = {
      women: products_for_woman,
      men: products_for_man,
      kids: products_for_kids,
    }

    return dataMap[category];
  }
}