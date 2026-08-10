import { createAsyncThunk } from "@reduxjs/toolkit";
import { getWarehouses, searchSettlements } from "@/services/nova-poshta.api.ts";
import type { NPAddressItem } from "@/types/integrations/nova-poshta-response.ts";
import type { CityOption, WarehouseOption } from "@/types/form/checkout.order.types.ts";

export const searchSettlementsThunk = createAsyncThunk<
  CityOption[],
  string
>(
  'novaPoshta/getCities',
  async (cityName, { rejectWithValue }) => {
    try {
      const response = await searchSettlements({cityName});
      const cities = response.Addresses || [];

      return cities.map((city: NPAddressItem) => ({
        mainDescription: city.Present || '',
        value: city.DeliveryCity,
        label: city.Present || '',
        ref: city.Ref,
        deliveryCity: city.DeliveryCity,
      }));

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || 'Error loading cities',
      );
    }
  },
);

export const getWarehousesThunk = createAsyncThunk<
  WarehouseOption[],
  { cityRef: string; findByString?: string }
>(
  'novaPoshta/getWarehouses',
  async ({cityRef, findByString}, {rejectWithValue}) => {
    try {
      const warehouses = await getWarehouses({cityRef, findByString});

      return warehouses.map((wh: any) => ({
        cityRef: wh.CityRef,
        ref: wh.Ref,
        longitude: wh.Longitude,
        latitude: wh.Latitude,
        description: wh.Description,
        value: wh.Ref,
        label: wh.Description,
      }));
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors?.[0] || 'Error loading warehouses',
      )
    }
  },
);