import axios from "axios";
import type { NPCity, NPSearchResponse, NPWarehouse } from "@/types/integrations/nova-poshta-response.ts";

const API_KEY = import.meta.env.VITE_NOVA_POSHTA_API_KEY;

const apiNP = axios.create({
  baseURL: 'https://api.novaposhta.ua/v2.0/json/',
})

interface SearchSettlementsParams {
  cityName: string;
  page?: number;
  limit?: number;
}

interface GetWarehouses {
  cityRef: string;
  findByString?: string;
  page?: number;
  limit?: number;
}

export const searchSettlements = async ({cityName, page = 1, limit = 20}: SearchSettlementsParams) => {
  const { data } = await apiNP.post<NPSearchResponse<NPCity>>('', {
    apiKey: API_KEY,
    modelName: 'AddressGeneral',
    calledMethod: 'searchSettlements',
    methodProperties: {
      CityName: cityName,
      Limit: limit,
      Page: page,
    }
  });

  return data.data[0] || [];
};


export const getWarehouses = async ({cityRef, findByString, page = 1, limit = 20}: GetWarehouses) => {
  const { data } = await apiNP.post<NPSearchResponse<NPWarehouse>>('', {
    apiKey: import.meta.env.VITE_NOVA_API_KEY,
    modelName: 'Address',
    calledMethod: 'getWarehouses',
    methodProperties: {
      CityRef: cityRef,
      FindByString: findByString,
      Page: page,
      Limit: limit,
    },
  })

  return data.data;
}
