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
      center: [3.3792, 6.5244], // Lagos default
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

  // Draw markers and driving route
  const drawMarkersAndLine = useCallback(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    pickupMk.current?.remove();
    dropMk.current?.remove();

    // Add pickup marker
    if (pickup) {
      pickupMk.current = new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat([pickup.lng, pickup.lat])
        .addTo(map);
    }

    // Add dropoff marker
    if (dropoff) {
      dropMk.current = new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat([dropoff.lng, dropoff.lat])
        .addTo(map);
    }

    // Fetch and draw driving route
    if (pickup && dropoff) {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (!data.routes || !data.routes[0]) return;

          const route = data.routes[0].geometry;

          if (map.getSource("route")) {
            (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
              type: "Feature",
              geometry: route,
              properties: {},
            });
          } else {
            map.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: route,
                properties: {},
              },
            });

            map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#3b82f6",
                "line-width": 4,
              },
            });
          }

          // Fit map to full route
          const b = new mapboxgl.LngLatBounds();
          route.coordinates.forEach(([lng, lat]: [number, number]) =>
            b.extend([lng, lat])
          );
          map.fitBounds(b, { padding: 60 });
        })
        .catch((err) => console.error("Error fetching directions:", err));
    }
  }, [pickup, dropoff]);

  useEffect(() => {
    drawMarkersAndLine();
  }, [drawMarkersAndLine]);

  return { mapWrap };
};
