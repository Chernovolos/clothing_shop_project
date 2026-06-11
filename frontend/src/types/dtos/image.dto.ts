import type { ColorDto } from './color.dto';

export interface ImageDto {
  id: number;
  color: ColorDto | null;
  url: string;
  title: string;
  isPrimary: boolean;
}

export interface CreateImageDto {
  colorId?: number;
  url: string;
  title: string;
  isPrimary: boolean;
}
