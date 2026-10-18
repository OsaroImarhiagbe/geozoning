import { useQuery, useMutation } from "@tanstack/react-query";
import { ZoningServiceAPI } from "../api/zone";
import axios from "axios";
const key = process.env.NEXT_PUBLIC_MAP_BOX_KEY;
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

export const useGetLocation = () => {
  return useMutation({
    mutationFn: async (search_text: string) => {
      const response = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${search_text}&access_token=${key}`,
      );

      return response;
    },
  });
};
