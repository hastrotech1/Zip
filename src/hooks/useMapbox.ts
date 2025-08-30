import { useRef, useEffect, useCallback } from "react";
import mapboxgl, { Map as MapBoxMap } from "mapbox-gl";
import { Coordinates } from "../../helper/types";
import { MAPBOX_TOKEN } from "../Customer/pages/components/Constants/vehicles";

mapboxgl.accessToken = MAPBOX_TOKEN || "";

export const useMapbox = (
  pickup: Coordinates | null,
  dropoff: Coordinates | null,
  onLocationUpdate: (location: Coordinates, text: string) => void
) => {
  const mapWrap = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapBoxMap | null>(null);
  const pickupMk = useRef<mapboxgl.Marker | null>(null);
  const dropMk = useRef<mapboxgl.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapWrap.current) return;

    const map = new mapboxgl.Map({
      container: mapWrap.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [3.3792, 6.5244],
      zoom: 12,
    });
    mapRef.current = map;
    map.resize();

    const geo = new mapboxgl.GeolocateControl({
      trackUserLocation: true,
      showAccuracyCircle: false,
    });
    map.addControl(geo);

    geo.on("geolocate", (e) => {
      const pos = { lng: e.coords.longitude, lat: e.coords.latitude };
      if (!pickup) {
        onLocationUpdate(pos, "Current location");
      }
    });
  }, [pickup, onLocationUpdate]);

  // Draw markers and route
  const drawMarkersAndLine = useCallback(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    pickupMk.current?.remove();
    dropMk.current?.remove();

    if (pickup) {
      pickupMk.current = new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat([pickup.lng, pickup.lat])
        .addTo(map);
    }
    if (dropoff) {
      dropMk.current = new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat([dropoff.lng, dropoff.lat])
        .addTo(map);
    }

    if (pickup && dropoff) {
      const geojson = {
        type: "Feature" as const,
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [pickup.lng, pickup.lat],
            [dropoff.lng, dropoff.lat],
          ],
        },
        properties: {},
      };

      if (map.getSource("route")) map.removeLayer("route");
      if (map.getSource("route")) map.removeSource("route");

      map.addSource("route", { type: "geojson", data: geojson });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
        },
      });

      const b = new mapboxgl.LngLatBounds();
      b.extend([pickup.lng, pickup.lat]);
      b.extend([dropoff.lng, dropoff.lat]);
      map.fitBounds(b, { padding: 60 });
    }
  }, [pickup, dropoff]);

  useEffect(() => {
    drawMarkersAndLine();
  }, [drawMarkersAndLine]);

  return { mapWrap };
};
