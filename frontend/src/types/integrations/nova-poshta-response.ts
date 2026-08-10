
/**
 * Generic API Response wrapper for Nova Poshta search queries
 */
export interface NPSearchResponse<SearchType> {
  success: boolean;
  data: SearchType[];
  errors: string[];
  warnings: string[];
  info: any[];
  messageCodes: string[];
  errorCodes: string[];
  warningCodes: string[];
  infoCodes: string[];
}

/**
 * Representation of a City/Settlement (Address object) in Nova Poshta
 */
export interface NPCity {
  StreetsAvailability?: boolean;
  RegionTypesCode?: string;
  AddressDeliveryAllowed?: boolean;
  TotalCount: string;
  Addresses: NPAddressItem[];
  Warehouses?: string;
  MainDescription?: string;
  Area?: string;
  Region?: string;
  SettlementTypeCode?: string;
  Ref?: string;
  DeliveryCity?: string;
  Present?: string;
  RegionTypes?: string;
  ParentRegionCode?: string;
  ParentRegionTypes?: string;
}

export interface NPAddressItem {
  Present?: string;
  Warehouses: number;
  MainDescription: string;
  Area: string;
  Region: string;
  SettlementTypeCode: string;
  Ref: string;
  DeliveryCity: string;
  AddressDeliveryAllowed: boolean;
  StreetsAvailability: boolean;
  ParentRegionTypes: string;
  ParentRegionCode: string;
  RegionTypes: string;
  RegionTypesCode: string;
}

export interface NPLimitationsOnDimensions {
  Width: number;
  Height: number;
  Length: number;
}

export interface NPWeekSchedule {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}

/**
 * Representation of a Nova Poshta Warehouse / Branch / Postomat
 */
export interface NPWarehouse {
  SiteKey: string;
  Description: string;
  DescriptionRu: string;
  ShortAddress: string;
  ShortAddressRu: string;
  Phone: string;
  TypeOfWarehouse: string;
  Ref: string;
  Number: string;
  CityRef: string;
  CityDescription: string;
  CityDescriptionRu: string;
  SettlementRef: string;
  SettlementDescription: string;
  SettlementAreaDescription: string;
  SettlementRegionsDescription: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu: string;
  Longitude: string; // Passed as a stringified float in JSON payloads
  Latitude: string;  // Passed as a stringified float in JSON payloads
  PostFinance: "1" | "0";
  BicycleParking: "1" | "0";
  PaymentAccess: "1" | "0";
  POSTerminal: "1" | "0";
  InternationalShipping: "1" | "0";
  SelfServiceWorkplacesCount: string;
  TotalMaxWeightAllowed: string;
  PlaceMaxWeightAllowed: string;
  SendingLimitationsOnDimensions: NPLimitationsOnDimensions;
  ReceivingLimitationsOnDimensions: NPLimitationsOnDimensions;
  Reception: NPWeekSchedule;
  Delivery: NPWeekSchedule;
  Schedule: NPWeekSchedule;
  DistrictCode: string;
  WarehouseStatus: string;
  WarehouseStatusDate: string;
  CategoryOfWarehouse: string;
  RegionCity: string;
  WarehouseForAgent: "1" | "0";
  MaxDeclaredCost: string;
  DenyToSelect: "1" | "0";
  PostMachineType: "" | "None" | "FullDayService" | "PartTime" | "ForResidentOfEntrance" | "Private" | "LimitedAccess";
  PostalCodeUA: string;
  OnlyReceivingParcel: "1" | "0";
  WarehouseIndex: string;
}