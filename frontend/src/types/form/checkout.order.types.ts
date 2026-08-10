//CHECKOUT ORDER TYPES//
export type CityOption = {
  mainDescription: string,
  value: string,
  label: string,
  ref: string,
  deliveryCity: string,
}

export type WarehouseOption = {
  cityRef: string;
  ref: string;
  longitude: string;
  latitude: string;
  description: string;
  value: string;
  label: string;
}

export type UserInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  comment: string;
}

export type MarkersOption = {
  id: string;
  ref: string;
  lat: number;
  lng: number;
}