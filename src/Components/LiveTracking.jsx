import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import api from "../api";

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/";

// Load the free Leaflet map library once
const loadLeaflet = () =>
  new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${CDN}leaflet.min.css`;
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = `${CDN}leaflet.min.js`;
    js.onload = () => resolve(window.L);
    js.onerror = () => reject(new Error("The map could not be loaded. Please check your internet connection."));
    document.body.appendChild(js);
  });

// Round pin with an emoji (no picture files needed)
const pin = (L, emoji, color) =>
  L.divIcon({
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `<div style="width:40px;height:40px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.35)">${emoji}</div>`,
  });

// Shows where the delivery person is while the order is "Out for Delivery"
export default function LiveTracking({ order }) {
  const [position, setPosition] = useState(null); // { lat, lng, at } or null
  const [error, setError] = useState("");
  const box = useRef(null);
  const map = useRef(null);
  const truck = useRef(null);
  const home = useRef(null);

  // Ask the server for the position now and every 10 seconds
  useEffect(() => {
    let alive = true;
    const load = () =>
      api.get(`/tracking/${order.id}`).then((res) => alive && setPosition(res.data.position)).catch(() => {});
    load();
    const timer = setInterval(load, 10000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [order.id]);

  // Draw the map the first time, then only move the truck
  useEffect(() => {
    if (!position) return;
    loadLeaflet()
      .then((L) => {
        const spot = [position.lat, position.lng];

        if (map.current) {
          truck.current.setLatLng(spot);
          if (!home.current) map.current.panTo(spot);
          return;
        }
        if (!box.current || box.current._leaflet_id) return;

        map.current = L.map(box.current).setView(spot, 15);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map.current);
        truck.current = L.marker(spot, { icon: pin(L, "🚚", "#087ee8") }).addTo(map.current);

        // the delivery address (found with the free OpenStreetMap search)
        const a = order.address || {};
        const place = [a.pincode, a.city, a.state, a.country].filter(Boolean).join(", ");
        fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`)
          .then((res) => res.json())
          .then(([found]) => {
            if (!found || !map.current) return;
            const target = [Number(found.lat), Number(found.lon)];
            home.current = L.marker(target, { icon: pin(L, "🏠", "#16a05a") }).addTo(map.current);
            map.current.fitBounds([spot, target], { padding: [40, 40] });
          })
          .catch(() => {});
      })
      .catch((err) => setError(err.message));
  }, [position]);

  // Remove the map when the page is closed
  useEffect(
    () => () => {
      map.current?.remove();
      map.current = null;
    },
    []
  );

  return (
    <section className="live-tracking">
      <h3><MapPin size={20} /> Live Delivery Location</h3>
      {error && <p>{error}</p>}

      {position ? (
        <>
          <div ref={box} className="live-map"></div>
          <small>Last updated {new Date(position.at).toLocaleTimeString("en-IN")} · refreshes every 10 seconds</small>
        </>
      ) : (
        <p>Your delivery person has not shared the live location yet. It appears here as soon as the sharing starts.</p>
      )}
    </section>
  );
}