import axios, { type AxiosInstance } from "axios";
import { type ProductDetailsDto, type ProductFilterDto } from "@/types/dtos/product.dto.ts";
import type { CreateUserDto, UserDto, UserLoginDto } from "@/types/dtos/user.dto.ts";
import type { AuthResponseDto } from "@/types/dtos/auth.dto.ts";

class ApiService {
  private static _api: AxiosInstance | null = null;
  private static get api() {
    if (!this._api) {
      this._api = axios.create({
        baseURL: import.meta.env.VITE_SERVER_API_URL,
      });

      this._api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${ token }`;
        }
        return config;
      })

      this._api.interceptors.response.use(
        (res) => res,
        (error) => {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("accessToken");
          }
          const normalizedError = {
            message: error.response?.data?.message || 'Network Error',
            status: error.response?.status,
            };
          return Promise.reject(normalizedError);
        },
      )
    }
    return this._api;
  }

  public async getProducts(filter: ProductFilterDto): Promise<ProductDetailsDto[]> {
    const result = await ApiService.api.post<ProductDetailsDto[]>('/products/filter', filter)
    return result.data;
  }

  public async getProductById(id: number): Promise<ProductDetailsDto> {
    const result = await ApiService.api.get<ProductDetailsDto>(`/products/${ id }`)
    return result.data;
  }

  public async createUser(newUser: CreateUserDto): Promise<UserDto> {
    const result = await ApiService.api.post<UserDto>(`/users/signup`, newUser)
    return result.data;
  }

  public async getSelfUser(): Promise<UserDto> {
    const result = await ApiService.api.get<UserDto>(`/users/self`)
    return result.data;
  }

  public async login(user: UserLoginDto): Promise<AuthResponseDto> {
    const result = await ApiService.api.post<AuthResponseDto>(`/auth/login`, user)
    return result.data;
  }
}

export default new ApiService();