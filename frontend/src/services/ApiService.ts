import axios, { type AxiosInstance } from "axios";
import { type ProductDetailsDto, type ProductFilterDto } from "@/types/dtos/product.dto.ts";

class ApiService {
  private static _api: AxiosInstance | null = null;
  private static get api() {
    if (!this._api) {
      this._api = axios.create({
        baseURL: import.meta.env.VITE_SERVER_API_URL
      });
    }
    return this._api;
  }

  public async getProducts(filter: ProductFilterDto): Promise<ProductDetailsDto[]> {
    const result = await ApiService.api.post<ProductDetailsDto[]>('/products/filter', filter)
    return result.data;
  }

  public async getProductById(id: number): Promise<ProductDetailsDto> {
    const result = await ApiService.api.get<ProductDetailsDto>(`/products/${id}`)
    return result.data;
  }

}

export default new ApiService();