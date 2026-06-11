
export interface ColorDto {
  id: number;
  code: string;
  hex: string;
}

export interface CreateColorDto {
  code: string;
  hex: string;
}

export interface UpdateColorDto {
  code: string;
  hex: string;
}
