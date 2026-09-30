import { useRef, useEffect } from "react";
import * as mapboxgl from "mapbox-gl/esm";
import "mapbox-gl/dist/mapbox-gl.css";
const key = process.env.MAP_BOX_KEY;

function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // Bounding box coordinates for Alexandria, VA
  // Format: [Southwest [lng, lat], Northeast [lng, lat]]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const alexandriaBounds: [[number, number], [number, number]] = [
    [-77.14537, 38.7844], // Southwest corner
    [-77.01988, 38.84699], // Northeast corner
  ];
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    mapRef.current = new mapboxgl.Map({
      accessToken: key,
      container,
      style: "mapbox://styles/mapbox/standard", // style URL
      center: [-77.0469, 38.8048], // Starting position near Old Town Alexandria
      zoom: 13, // Starting zoom level
      minZoom: 11, // Prevents zooming out to the global view
      maxBounds: alexandriaBounds,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [alexandriaBounds]);

  return (
    <>
      <div
        id="map-container"
        className="relative h-[580px] w-full overflow-hidden rounded-xl"
        ref={mapContainerRef}
      />
    </>
  );
}

export default Map;
