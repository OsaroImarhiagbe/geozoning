"use client";
import { useRef, useEffect } from "react";
import * as mapboxgl from "mapbox-gl/esm";
import "mapbox-gl/dist/mapbox-gl.css";
import { useDashboardStore } from "../store/useDashboardStore";
import { useGetParcels } from "../hooks/useDashboard";

const key = process.env.NEXT_PUBLIC_MAP_BOX_KEY;

// Alexandria, VA bounding box
const ALEXANDRIA_BOUNDS: [[number, number], [number, number]] = [
  [-77.14537, 38.7844], // Southwest
  [-77.01988, 38.84699], // Northeast
];

const ALEXANDRIA_CENTER: [number, number] = [-77.0469, 38.8048];

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Zustand store
  const min_lng = useDashboardStore((state) => state.min_lng);
  const min_lat = useDashboardStore((state) => state.min_lat);
  const max_lng = useDashboardStore((state) => state.max_lng);
  const max_lat = useDashboardStore((state) => state.max_lat);
  const setMinLng = useDashboardStore((state) => state.setMinLng);
  const setMinLat = useDashboardStore((state) => state.setMinLat);
  const setMaxLng = useDashboardStore((state) => state.setMaxLng);
  const setMaxLat = useDashboardStore((state) => state.setMaxLat);

  // Fetch parcels — refetches when bbox changes
  const { data: parcelData } = useGetParcels(
    min_lng,
    min_lat,
    max_lng,
    max_lat,
  );

  // Initialize map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const map = new mapboxgl.Map({
      accessToken: key,
      container,
      style: "mapbox://styles/mapbox/standard",
      center: ALEXANDRIA_CENTER,
      zoom: 13,
      minZoom: 11,
      maxBounds: ALEXANDRIA_BOUNDS,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Set initial bbox in Zustand from the actual map bounds
      const bounds = map.getBounds();
      if (bounds) {
        setMinLng(bounds.getWest());
        setMinLat(bounds.getSouth());
        setMaxLng(bounds.getEast());
        setMaxLat(bounds.getNorth());
      }

      // Add empty parcel source — data gets added once fetched
      map.addSource("parcels", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Fill layer — colors parcel interiors by zone_code
      map.addLayer({
        id: "parcels-fill",
        type: "fill",
        source: "parcels",
        paint: {
          "fill-color": [
            "match",
            ["get", "zone_code"],
            "CC",
            "#ef4444", // Commercial Community — red
            "CL",
            "#f97316", // Commercial Low — orange
            "R-8",
            "#eab308", // Single Family Residential — yellow
            "R-5",
            "#eab308",
            "R-2-5",
            "#eab308",
            "RA",
            "#84cc16", // Multifamily — light green
            "RB",
            "#84cc16",
            "I",
            "#a855f7", // Industrial — purple
            "#94a3b8", // Default — grey for unmapped codes
          ],
          "fill-opacity": 0.5,
        },
      });

      // Line layer — draws parcel boundaries
      map.addLayer({
        id: "parcels-line",
        type: "line",
        source: "parcels",
        paint: {
          "line-color": "#1e293b",
          "line-width": 0.5,
          "line-opacity": 0.8,
        },
      });
    });

    // Update bbox in Zustand when user pans or zooms
    map.on("moveend", () => {
      const bounds = map.getBounds();
      if (bounds) {
        setMinLng(bounds.getWest());
        setMinLat(bounds.getSouth());
        setMaxLng(bounds.getEast());
        setMaxLat(bounds.getNorth());
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update parcel source whenever API data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !parcelData) return;

    const source = map.getSource("parcels") as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(parcelData);
    }
  }, [parcelData]);

  return (
    <div
      id="map-container"
      className="relative h-[580px] w-full overflow-hidden rounded-xl"
      ref={mapContainerRef}
    />
  );
}
