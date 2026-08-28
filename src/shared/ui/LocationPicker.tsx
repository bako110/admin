import { useEffect, useRef, useState } from 'react';
import { MapPin, Link2 } from 'lucide-react';
import clsx from 'clsx';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import formStyles from './formLayout.module.css';
import styles from './LocationPicker.module.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER: [number, number] = [12.3714, -1.5197]; // Ouagadougou

function parseGoogleMapsLink(input: string): { lat: number; lng: number } | null {
  const trimmed = input.trim();

  const plainPair = trimmed.match(/^(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (plainPair) {
    const lat = Number(plainPair[1]);
    const lng = Number(plainPair[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }

  const atMatch = trimmed.match(/@(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/);
  if (atMatch) {
    return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) };
  }

  try {
    const url = new URL(trimmed);
    const q = url.searchParams.get('q') ?? url.searchParams.get('query');
    if (q) {
      const qMatch = q.match(/(-?\d{1,3}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/);
      if (qMatch) return { lat: Number(qMatch[1]), lng: Number(qMatch[2]) };
    }
  } catch {
    // not a valid URL, ignore
  }

  return null;
}

interface LocationPickerProps {
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
}

export function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [mode, setMode] = useState<'map' | 'link'>('map');
  const [linkInput, setLinkInput] = useState('');
  const [linkError, setLinkError] = useState('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mode !== 'map' || !mapContainerRef.current || mapRef.current) return;

    const initialLat = latitude ? Number(latitude) : DEFAULT_CENTER[0];
    const initialLng = longitude ? Number(longitude) : DEFAULT_CENTER[1];

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], latitude ? 13 : 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    if (latitude && longitude) {
      markerRef.current = L.marker([initialLat, initialLng]).addTo(map);
    }

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }
      onChange(lat.toFixed(6), lng.toFixed(6));
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    }
  }, [latitude, longitude]);

  function handleLinkSubmit() {
    const result = parseGoogleMapsLink(linkInput);
    if (!result) {
      setLinkError("Lien non reconnu. Colle un lien Google Maps ou des coordonnées 'lat, lng'.");
      return;
    }
    setLinkError('');
    onChange(result.lat.toFixed(6), result.lng.toFixed(6));
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={clsx(styles.tab, mode === 'map' && styles.tabActive)}
          onClick={() => setMode('map')}
        >
          <MapPin size={14} strokeWidth={2} />
          Carte
        </button>
        <button
          type="button"
          className={clsx(styles.tab, mode === 'link' && styles.tabActive)}
          onClick={() => setMode('link')}
        >
          <Link2 size={14} strokeWidth={2} />
          Lien Google Maps
        </button>
      </div>

      {mode === 'map' && (
        <div ref={mapContainerRef} className={styles.map} />
      )}

      {mode === 'link' && (
        <div className={styles.linkRow}>
          <input
            type="text"
            className={styles.linkInput}
            placeholder="https://maps.google.com/?q=12.35,-1.52"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
          />
          <button type="button" className={styles.linkButton} onClick={handleLinkSubmit}>
            Utiliser
          </button>
        </div>
      )}
      {linkError && <p className={formStyles.errorText}>{linkError}</p>}

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Latitude</label>
          <input
            type="number"
            step="any"
            className={styles.coordInput}
            value={latitude}
            onChange={(e) => onChange(e.target.value, longitude)}
          />
        </div>
        <div className={formStyles.field}>
          <label className={formStyles.label}>Longitude</label>
          <input
            type="number"
            step="any"
            className={styles.coordInput}
            value={longitude}
            onChange={(e) => onChange(latitude, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
