import type {
  ProductCategory,
  ProductSubType,
  ProductType,
} from '../enums/product.enums.ts';
import type { ImageDto } from './image.dto';
import type { StockDto } from './stock.dto';
import type { TagDto } from './tag.dto';


export interface ProductDto {
  id: number;
  title: string;
  price: number;
  image: ImageDto | null;
}

export interface ProductDetailsDto {
  id: number;
  title: string;
  categoryType: ProductCategory;
  description: string;
  price: number;
  type: ProductType;
  subType: ProductSubType;
  images: ImageDto[];
  stocks: StockDto[];
  tags: TagDto[];
}

export interface ProductFilterDto {
  categoryType?: ProductCategory;
  type?: ProductType;
  subType?: ProductSubType[];
  tags?: number[];
  colors?: number[];
  sizes?: number[];
  maxPrice?: number,
  minPrice?: number,
}
