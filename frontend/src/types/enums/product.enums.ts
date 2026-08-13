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

export const productTypeOptions = [
  // {label: "All types", value: PRODUCT_TYPE.DEFAULT},
  { label: "Accessories", value: PRODUCT_TYPE.ACCESSORIES },
  { label: "Clothing", value: PRODUCT_TYPE.CLOTHING },
  { label: "Shoes", value: PRODUCT_TYPE.SHOES },
];

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

export const productSubTypeOptions = [
  // {label: "All types", value: PRODUCT_SUBTYPE.DEFAULT},
  { label: "T_SHIRT", value: PRODUCT_SUBTYPE.T_SHIRT },
  { label: "JEANS", value: PRODUCT_SUBTYPE.JEANS },
  { label: "BLAZERS", value: PRODUCT_SUBTYPE.BLAZERS },
  { label: "JACKETS", value: PRODUCT_SUBTYPE.JACKETS },

  { label: "SHIRTS", value: PRODUCT_SUBTYPE.SHIRTS },
  { label: "SKIRTS", value: PRODUCT_SUBTYPE.SKIRTS },
  { label: "TROUSERS", value: PRODUCT_SUBTYPE.TROUSERS },
  { label: "TOPS", value: PRODUCT_SUBTYPE.TOPS },
  { label: "DRESSES", value: PRODUCT_SUBTYPE.DRESSES },
  { label: "BAGS", value: PRODUCT_SUBTYPE.BAGS },
  { label: "JEWELRY", value: PRODUCT_SUBTYPE.JEWELRY },
];

// --- SIZES (XS, S, M...) ---
export const PRODUCT_SIZE =  {
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

// ----- TAGS
export const productTagsOptions = [
  // { label: "All styles", value: "" },
  { label: "Baggy", value: 1 },
  { label: "High Waist", value: 2 },
  { label: "Mom Fit", value: 3 },
  { label: "Balloon", value: 4 },
  { label: "Mid", value: 5 },
  { label: "Barrel", value: 6 },
  { label: "Straight", value: 7 },
  { label: "Classic", value: 8 },
  { label: "Slim Fit", value: 9 },
  { label: "Denim", value: 10 },
  { label: "Cotton", value: 11 },
  { label: "Basic", value: 12 },
  { label: "Jersey", value: 13 },
  { label: "Relaxed Fit", value: 14 },
  { label: "Tailored", value: 15 },
  { label: "Minimal", value: 16 },
  { label: "Structured", value: 17 },
  { label: "Oversized", value: 18 },
  { label: "Elegant", value: 19 },
  { label: "Relaxed", value: 20 },
  { label: "Premium", value: 21 },
  { label: "Regular Fit", value: 22 },
  { label: "Straight Fit", value: 23 },
  { label: "Wool", value: 24 },
  { label: "Essential", value: 25 },
];

