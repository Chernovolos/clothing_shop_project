export const ORDER_STATUS = {
  NEW: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  COMPLETED: 4,
  CANCELED: 5,
  REFUNDED: 6,
}

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_ITEM_TYPE = {
  PRODUCT: 0,
  DELIVERY: 1,
}

export type OrderItemType = (typeof ORDER_ITEM_TYPE)[keyof typeof ORDER_ITEM_TYPE];

export const ORDER_PAYMENT_TYPE = {
  CARD: 0,
  CASH: 1,
}

export type OrderPaymentType = (typeof ORDER_PAYMENT_TYPE)[keyof typeof ORDER_PAYMENT_TYPE];