"use client";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useDashboardStore } from "../store/useDashboardStore";
import { useGetParcels } from "../hooks/useDashboard";
// import { Geocoder } from "@mapbox/search-js-react";
let key: string;
if (process.env.NEXT_PUBLIC_MAP_BOX_KEY) {
  key = process.env.NEXT_PUBLIC_MAP_BOX_KEY;
}

// Alexandria, VA bounding box
const ALEXANDRIA_BOUNDS: [[number, number], [number, number]] = [
  [-77.14537, 38.7844], // Southwest
  [-77.01988, 38.84699], // Northeast
];

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Zustand store
  const min_lng = useDashboardStore((state) => state.min_lng);
  const min_lat = useDashboardStore((state) => state.min_lat);
  const max_lng = useDashboardStore((state) => state.max_lng);
  const max_lat = useDashboardStore((state) => state.max_lat);
  const setMinLng = useDashboardStore((state) => state.setMinLng);
  const setMinLat = useDashboardStore((state) => state.setMinLat);
  const setMaxLng = useDashboardStore((state) => state.setMaxLng);
  const setMaxLat = useDashboardStore((state) => state.setMaxLat);

  console.log(`Min Lng: ${min_lng}`);
  console.log(`Min Lat: ${min_lat}`);
  console.log(`Max Lng: ${max_lng}`);
  console.log(`Max Lat: ${max_lat}`);
  console.log("lat: ", location.latitude);
  console.log("lng:", location.longitude);

  const ALEXANDRIA_CENTER: [number, number] = [
    location.longitude ?? -77.0469,
    location.latitude ?? 38.8048,
  ];
  // Fetch parcels — refetches when bbox changes
  // const { data: parcelData } = useGetParcels(
  //   min_lng,
  //   min_lat,
  //   max_lng,
  //   max_lat,
  // );

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // 1. Check if the browser supports the Geolocation API
    if (!navigator.geolocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Geolocation is not supported by your browser.");
      return;
    }
    mapRef.current = new mapboxgl.Map({
      accessToken: key,
      container,
      style: "mapbox://styles/mapbox/standard",
      center: ALEXANDRIA_CENTER,
      zoom: 13,
      maxBounds: ALEXANDRIA_BOUNDS,
    });

    mapRef.current.on("load", () => {
      setMapLoaded(true);
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude: latitude,
          longitude: longitude,
        });
      });
      // Set initial bbox in Zustand from the actual map bounds
      const bounds = mapRef?.current?.getBounds();
      if (bounds) {
        setMinLng(bounds.getWest());
        setMinLat(bounds.getSouth());
        setMaxLng(bounds.getEast());
        setMaxLat(bounds.getNorth());
      }

      // Add empty parcel source — data gets added once fetched
      mapRef.current?.addSource("alexandria", {
        type: "geojson",
        data: "/RealEstate_Parcels.geojson",
      });

      // Fill layer — colors parcel interiors by zone_code
      mapRef.current?.addLayer({
        id: "alexandria",
        type: "fill",
        source: "alexandria",
        layout: {},
        paint: {
          "fill-opacity": 0.6,
          "fill-color": [
            "match",
            ["get", "ZONING"],
            ["R-8", "R-12", "R-20", "RA", "RB"],
            "#f2c94c", // residential low
            ["RM", "RS", "RC"],
            "#f2994a", // residential medium/high
            ["CL", "CC", "CG", "CD"],
            "#eb5757", // commercial
            ["OC", "OCM", "OCH"],
            "#9b51e0", // office
            ["I", "W1"],
            "#4f4f4f", // industrial
            "#bdbdbd", // fallback for anything unmapped
          ],
        },
      });

      // Line layer — draws parcel boundaries
      mapRef.current?.addLayer({
        id: "parcels-outline",
        type: "line",
        source: "alexandria",
        paint: {
          "line-color": "#1d4ed8",
          "line-width": 1.5,
        },
      });
    });

    // Pointer cursor on hover
    mapRef.current?.on("mouseenter", "alexandria", () => {
      const map = mapRef.current;
      if (map) map.getCanvas().style.cursor = "pointer";
    });
    mapRef.current?.on("mouseleave", "alexandria", () => {
      const map = mapRef.current;
      if (map) map.getCanvas().style.cursor = "";
    });

    mapRef.current?.on("click", "alexandria", (e) => {
      const p = e.features[0].properties;
      mapRef.current?.setFilter("parcels-selected", [
        "==",
        ["get", "PID_RE"],
        p.PID_RE,
      ]);

      const el = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = p.ADDRESS_GIS || "No address";
      el.append(
        title,
        document.createElement("br"),
        `Parcel ID: ${p.PID_RE}`,
        document.createElement("br"),
        `Zoning: ${p.ZONING}`,
        document.createElement("br"),
        `Land use: ${p.LANDDESC}`,
        document.createElement("br"),
        `Lot size: ${Number(p.LAND_SF).toLocaleString()} sf`,
      );

      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setDOMContent(el)
        .addTo(mapRef.current);
    });

    // Update bbox in Zustand when user pans or zooms
    mapRef.current.on("moveend", () => {
      const bounds = mapRef.current?.getBounds();
      if (bounds) {
        setMinLng(bounds.getWest());
        setMinLat(bounds.getSouth());
        setMaxLng(bounds.getEast());
        setMaxLat(bounds.getNorth());
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [navigator.geolocation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update parcel source whenever API data changes
  // useEffect(() => {
  //   const map = mapRef.current;
  //   if (!map || !parcelData) return;

  //   const source = map.getSource("parcels") as mapboxgl.GeoJSONSource;
  //   if (source) {
  //     source.setData(parcelData);
  //   }
  // }, [parcelData]);

  return (
    <>
      {/* <Geocoder
                  accessToken={key}
                  options={{
                    language: "en",
                    country: "US",
                  }}
                  placeholder="Search by address, city, county, or coordinates..."
                /> */}
      <div
        id="map-container"
        className="relative h-[580px] w-full overflow-hidden rounded-xl"
        ref={mapContainerRef}
      />
    </>
  );
}
