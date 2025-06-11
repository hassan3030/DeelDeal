

'use client';

import { useState } from 'react';
import MapPicker from '@/components/map/MapPicker';
// import { getAddressFromCoords } from '@/lib/geocode';

export default function StoreForm() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState('');

  const handleLocationPick = async ({ lat, lng }) => {
    setLocation({ lat, lng });

    try {
      const addr = await getAddressFromCoords(lat, lng);
      setAddress(addr);
    } catch (err) {
      console.error(err);
      setAddress('No address found');
    }
  };

  return (
    <div className="p-4">
      <MapPicker onPick={handleLocationPick} />
      {location.lat && (
        <div className="mt-4">
          <p><strong>Lat:</strong> {location.lat}</p>
          <p><strong>Lng:</strong> {location.lng}</p>
          <p><strong>Address:</strong> {address || 'Loading...'}</p>
        </div>
      )}
    </div>
  );
}


// lib/geocode.js
export async function getAddressFromCoords(lat, lng) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );

  const data = await res.json();

  if (data.status === 'OK' && data.results.length > 0) {
    return data.results[0].formatted_address;
  } else {
    throw new Error('No address found');
  }
}
