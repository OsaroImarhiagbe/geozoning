type geomotry = {
  type: string;
  coordinates: number[][];
};
type parcelproperties = {
  pid: number;
  address: string;
  zone_code: string;
  land_desc: string;
  land_sf: number;
};
interface ParcelFeature {
  geometry: geomotry;
  propertiers: parcelproperties;
}

export interface ParcelResponse {
  type: string;
  features: ParcelFeature[];
}

export interface Bounding {
  min_lng: number;
  min_lat: number;
  max_lng: number;
  max_lat: number;
  setMinLng: (min_lng: number) => void;
  setMinLat: (min_lat: number) => void;
  setMaxLng: (max_lng: number) => void;
  setMaxLat: (max_lat: number) => void;
}
