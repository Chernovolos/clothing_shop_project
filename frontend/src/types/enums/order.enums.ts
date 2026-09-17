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

export const ORDER_STATUS_LABEL: Record<number, string> = {
  0: 'NEW',
  1: 'PROCESSING',
  2: 'SHIPPED',
  3: 'DELIVERED',
  4: 'COMPLETED',
  5: 'CANCELED',
  6: 'REFUNDED',
}

export const orderStatusToLabel = (orderStatus: OrderStatus) => {
  return ORDER_STATUS_LABEL[orderStatus];
}

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

export const ORDER_PAYMENT_TYPE_LABEL: Record<number, string> = {
  0: "Card",
  1: "Cash",
}

export const orderPaymentTypeToLabel = (payment: number) => {
  return ORDER_PAYMENT_TYPE_LABEL[payment];
}