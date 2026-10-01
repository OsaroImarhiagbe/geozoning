import { api } from "@/api/apiClient";
import { ParcelResponse } from "../type/types";
export const ZoningServiceAPI = {
  get_parcel: async (
    min_lng: number,
    min_lat: number,
    max_lng: number,
    max_lat: number,
  ) => {
    const response = await api.get<ParcelResponse>("/zoning/parcels", {
      params: {
        min_lng: min_lng,
        min_lat: min_lat,
        max_lng: max_lng,
        max_lat: max_lat,
      },
    });
    return response.data;
  },
};
