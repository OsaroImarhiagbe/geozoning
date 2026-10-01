import { useQuery } from "@tanstack/react-query";
import { ZoningServiceAPI } from "../api/zone";

export const useGetParcels = (
  min_lng: number,
  min_lat: number,
  max_lng: number,
  max_lat: number,
) => {
  return useQuery({
    // Include bbox in key so query refetches when user pans/zooms
    queryKey: ["parcels", min_lng, min_lat, max_lng, max_lat],
    queryFn: async () => {
      const response = await ZoningServiceAPI.get_parcel(
        min_lng,
        min_lat,
        max_lng,
        max_lat,
      );
      return response.data;
    },
    enabled: !!(min_lng && min_lat && max_lng && max_lat),
  });
};
