import { useEffect, useRef } from "react";

const LOCATIONS: { name: string; coords: [number, number]; hq?: boolean }[] = [
  { name: "ClearWaterIreland HQ", coords: [53.3498, -6.2603], hq: true },
  { name: "Leixlip", coords: [53.3648, -6.4868] },
  { name: "Lucan", coords: [53.3542, -6.4472] },
  { name: "Blanchardstown", coords: [53.3893, -6.3752] },
  { name: "Swords", coords: [53.4597, -6.2181] },
  { name: "Malahide", coords: [53.4503, -6.1545] },
  { name: "Tallaght", coords: [53.2876, -6.3744] },
  { name: "Dún Laoghaire", coords: [53.2940, -6.1357] },
];

const POLYGON: [number, number][] = [
  [53.50, -6.10], [53.48, -6.50], [53.36, -6.55], [53.25, -6.45],
  [53.22, -6.30], [53.24, -6.10], [53.32, -6.05], [53.45, -6.05],
];

export default function ServiceMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    let cancelled = false;
    let mapInstance: any = null;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !ref.current) return;

      const map = L.map(ref.current, { center: [53.3498, -6.2603], zoom: 11, zoomControl: true, scrollWheelZoom: false, attributionControl: false });
      mapRef.current = map;
      mapInstance = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19, subdomains: "abcd",
      }).addTo(map);

      L.polygon(POLYGON, { fillColor: "#3EB3DE", fillOpacity: 0.08, color: "#3EB3DE", weight: 1.5, opacity: 0.4 }).addTo(map);

      LOCATIONS.forEach((loc) => {
        const icon = L.divIcon({
          className: "",
          html: `<div class="map-marker${loc.hq ? " hq" : ""}"></div>`,
          iconSize: loc.hq ? [24, 24] : [18, 18],
          iconAnchor: loc.hq ? [12, 12] : [9, 9],
        });
        L.marker(loc.coords, { icon }).addTo(map).bindPopup(`<strong>${loc.name}</strong><br/>Same-week installation available`);
      });
    })();

    return () => {
      cancelled = true;
      if (mapInstance) {
        mapInstance.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div ref={ref} id="service-map" style={{ height: 420, width: "100%", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", background: "var(--surface)" }} />
      <style>{`
        @media (max-width: 700px) { #service-map { height: 300px !important; } }
        .leaflet-popup-content { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; }
      `}</style>
    </div>
  );
}
