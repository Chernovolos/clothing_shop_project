// --- PRODUCT CATEGORY  ---
export const PRODUCT_CATEGORY  = {
  DEFAULT: 0,
  WOMEN: 1,
  MEN: 2,
  KIDS: 3,
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY )[keyof typeof PRODUCT_CATEGORY ];

export const CATEGORY_MAP: Record<string, ProductCategory> = {
  women: PRODUCT_CATEGORY.WOMEN,
  men: PRODUCT_CATEGORY.MEN,
  kids: PRODUCT_CATEGORY.KIDS,
};

// --- PRODUCT TYPE  ---
export const PRODUCT_TYPE =  {
  DEFAULT: 0,
  ACCESSORIES: 1,
  CLOTHING: 2,
  SHOES: 3,
} as const;

export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

// --- PRODUCT SUB_TYPE  ---
export const PRODUCT_SUBTYPE = {
  DEFAULT: 0,
  T_SHIRT: 1,
  JEANS: 2,
  BLAZERS: 3,
  JACKETS: 4,
  SHIRTS: 5,
  SKIRTS: 6,
  TROUSERS: 7,
  TOPS: 8,
  DRESSES: 9,
  BAGS: 10,
  JEWELRY: 11,
} as const;

export type ProductSubType = typeof PRODUCT_SUBTYPE[keyof typeof PRODUCT_SUBTYPE];

// --- SIZES (XS, S, M...) ---
export const PRODUCT_SIZE =  {
  DEFAULT: 0,
  XXS: 1,
  XS: 2,
  S: 3,
  M: 4,
  L: 5,
  XL: 6,
  XXL: 7,
} as const

export type ProductSize = typeof PRODUCT_SIZE[keyof typeof PRODUCT_SIZE];

export const PRODUCT_SIZE_LABEL: Record<number, string> = {
  0: "DEFAULT",
  1: "XXS",
  2: "XS",
  3: "S",
  4: "M",
  5: "L",
  6: "XL",
  7: "XXL",
};

export const sizeToLabel = (size: number) => {
  return PRODUCT_SIZE_LABEL[size];
};

export const labelToSize = (label: keyof typeof PRODUCT_SIZE) => {
  return PRODUCT_SIZE[label];
};

