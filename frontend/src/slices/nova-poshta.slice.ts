import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from "../app/store.ts";
import { getWarehousesThunk, searchSettlementsThunk } from "@/thunk/nova-poshta.thunk.ts";
import type { CityOption, MarkersOption, WarehouseOption } from "@/types/form/checkout.order.types.ts";

interface NovaPoshtaState {
  cities: CityOption[];
  warehouses: WarehouseOption[];
  citySelection: CityOption | null;
  warehouseSelection: WarehouseOption | null;

  isLoadingCities: boolean;
  isLoadingWarehouses: boolean;
  error: string | null;
}

const initialState: NovaPoshtaState = {
  cities: [],
  warehouses: [],
  citySelection: null,
  warehouseSelection: null,
  isLoadingCities: false,
  isLoadingWarehouses: false,
  error: null,
};

export const novaPoshtaSlice = createSlice({
  name: 'novaPoshta',
  initialState,
  reducers: {
    setCitySelection: (state, action: PayloadAction<CityOption | null>) => {
      state.citySelection = action.payload;
      state.warehouses = [];
      state.warehouseSelection = null;
    },
    setWarehouseSelection: (state, action: PayloadAction<WarehouseOption | null>) => {
      state.warehouseSelection = action.payload;
    },
    clearCities: (state) => {
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchSettlementsThunk.pending, (state) => {
        state.isLoadingCities = true;
        state.error = null;
      })
      .addCase(searchSettlementsThunk.fulfilled, (state, action: PayloadAction<CityOption[]>) => {
        state.isLoadingCities = false;
        state.cities = action.payload;
      })
      .addCase(searchSettlementsThunk.rejected, (state, action) => {
        state.isLoadingCities = false;
        state.error = action.payload as string;
      })

      .addCase(getWarehousesThunk.pending, (state) => {
        state.isLoadingWarehouses = true;
        state.error = null;
      })
      .addCase(getWarehousesThunk.fulfilled, (state, action: PayloadAction<WarehouseOption[]>) => {
        state.isLoadingWarehouses = false;
        state.warehouses = action.payload;
      })
      .addCase(getWarehousesThunk.rejected, (state, action) => {
        state.isLoadingWarehouses = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCitySelection, setWarehouseSelection, clearCities } = novaPoshtaSlice.actions;

export const selectCities = (state: RootState) => state.novaPoshta.cities;
export const selectWarehouses = (state: RootState) => state.novaPoshta.warehouses;export const selectIsLoadingWarehouses = (state: RootState) => state.novaPoshta.isLoadingWarehouses;
export const selectSelectedWarehouse = (state: RootState) => state.novaPoshta.warehouseSelection;

export const selectWarehouseMarkers = createSelector(
  [selectWarehouses],
  (warehouses): MarkersOption[] =>
    warehouses
      .filter((wh) => wh.latitude && wh.longitude)
      .map((wh) => ({
        id: wh.ref,
        ref: wh.ref,
        lat: Number(wh.latitude),
        lng: Number(wh.longitude),
      })),
);

export default novaPoshtaSlice.reducer;