import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // REPLACE THIS with your Render URL + /api/noise/latest
        const res = await axios.get('https://noise-backend-c2vi.onrender.com/api/noise/latest');
        setData(res.data);
      } catch (err) { console.log(err); }
    };
    fetchData();
    setInterval(fetchData, 5000); // Check for new data every 5 seconds
  }, []);

  const getColor = (db) => db > 70 ? 'red' : db > 55 ? 'orange' : 'green';

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Live Noise Pollution Map</h1>
      <div style={{ height: '70vh', width: '100%', border: '2px solid black' }}>
        <MapContainer center={[30.7499, 76.6411]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {data.map((node) => (
            <CircleMarker key={node.deviceId} center={[node.lat, node.lng]} 
              pathOptions={{ fillColor: getColor(node.noiseLevel), color: getColor(node.noiseLevel) }} radius={20}>
              <Popup>{node.deviceId}: {node.noiseLevel.toFixed(1)} dB</Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
export default App;