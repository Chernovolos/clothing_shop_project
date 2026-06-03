import type { CartItem, Product } from "@/types/Product.ts";
import type { Order, OrderProduct } from "@/types/Order.ts";
import { products_for_kids, products_for_man, products_for_woman } from "@/mocks/products.ts";

const allProducts: Product[] = [
  ...products_for_man,
  ...products_for_woman,
  ...products_for_kids,
];

export default class MockOrderService {
  public static async getOrder(
    cartItem: CartItem,
    existOrder: Order | null,
  ): Promise<Order> {
    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    const product = allProducts.find((p) => p.id === cartItem.id);

    if (!product) {
      throw new Error("Product not found");
    }

    const newItem: OrderProduct = {
      id: Math.floor(Math.random() * 1000000),
      // productId: crypto.randomUUID(),
      color: cartItem.color,
      size: cartItem.size,
      quantity: cartItem.quantity,
      sum: cartItem.quantity * cartItem.price,
      product: {
        ...product,
      },
    }

    const existingItem = existOrder?.items.find(
      (item) =>
        item.product.id === product.id &&
        item.size === newItem.size &&
        item.color.id === newItem.color.id,
    );

    let updatedItems: OrderProduct[];

    if (existingItem) {
      updatedItems = existOrder!.items.map((item) => {
        const isSameItem =
          item.product.id === product.id &&
          item.size === newItem.size &&
          item.color.id === newItem.color.id;

        if (!isSameItem) {
          return item;
        }

        const updatedQuantity =
          item.quantity + newItem.quantity;

        return {
          ...item,

          quantity: updatedQuantity,

          sum: updatedQuantity * item.product.price,
        };
      })
    } else {
      updatedItems = existOrder
        ? [...existOrder.items, newItem]
        : [newItem];
    }

    const total = updatedItems.reduce((accumulator, item) => accumulator + item.sum, 0)

    const order: Order = {
      id: existOrder?.id || Date.now(),
      date: new Date().toISOString(),
      items: updatedItems,
      total: total,
    };

    if (!order) {
      throw new Error("Something went wrong");
    }

    return order;
  };

  public static async removeOrder(
    cartItem: CartItem,
    existOrder: Order | null,
  ): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!existOrder) {
      throw new Error("Order not found");
    }

    const updatedItems = existOrder?.items.filter((item) => {
      return !(
        item.id === cartItem.id &&
        item.size === cartItem.size &&
        item.color.id === cartItem.color.id
      );
    })

    const total = updatedItems?.reduce(
      (acc, item) => acc + item.sum,
      0,
    );

    return {
      ...existOrder,
      items: updatedItems,
      total,
    };
  };

  public static async updateOrder(
    cartItem: CartItem,
    existOrder: Order | null,
  ): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("CART ITEM", cartItem)
    if (!existOrder) {
      throw new Error("Order not found");
    }

    const updatedItems = existOrder.items.map((item) => {

      const exactMatch =
        item.id === cartItem.id &&
        item.size === cartItem.size &&
        item.color.id === cartItem.color.id;

      if (exactMatch) {
        const newQuantity = item.quantity + cartItem.quantity;
        return {
          ...item,
          quantity: newQuantity,
          sum: newQuantity * item.product.price,
        };
      } else if (item.id === cartItem.id) {
        return {
          ...item,
          size: cartItem.size,
          color: cartItem.color,
          quantity: cartItem.quantity,
          sum: cartItem.quantity * cartItem.price,
        };
      }

      return item;
    });

    const total = updatedItems.reduce(
      (acc, item) => acc + item.sum,
      0,
    );

    return {
      ...existOrder,
      date: new Date().toISOString(),
      items: updatedItems,
      total,
    };
  }
}