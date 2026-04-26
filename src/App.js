import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import './App.css'; // <-- Importing our new stylesheet!

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // NOTE: Make sure your live Render URL is correctly placed here!
        const res = await axios.get('https://YOUR_RENDER_URL_HERE.onrender.com/api/noise/latest');
        setData(res.data);
      } catch (err) { console.log(err); }
    };
    fetchData();
    setInterval(fetchData, 5000); 
  }, []);

  const getColor = (db) => db > 70 ? '#e74c3c' : db > 55 ? '#f39c12' : '#2ecc71';

  return (
    <div className="dashboard-container">
      
      {/* Header Section */}
      <header className="app-header">
        <h1>Live Noise Pollution Dashboard</h1>
        <p>Real-time acoustic mapping of Kharar residential zones</p>
      </header>

      {/* Map Section */}
      <main className="map-wrapper">
        <div className="map-card">
          <MapContainer center={[30.7499, 76.6411]} zoom={13} style={{ height: '100%', width: '100%' }}>
            
            {/* The base map graphic */}
            <TileLayer 
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
              attribution="&copy; OpenStreetMap"
            />
            
            {/* The dynamic sensor markers */}
            {data.map((node) => (
              <CircleMarker 
                key={node.deviceId} 
                center={[node.lat, node.lng]} 
                pathOptions={{ 
                  fillColor: getColor(node.noiseLevel), 
                  color: getColor(node.noiseLevel),
                  fillOpacity: 0.7 
                }} 
                radius={24}
              >
                <Popup>
                  <div className="custom-popup">
                    <div className="device-name">{node.deviceId}</div>
                    <div className="decibel" style={{ color: getColor(node.noiseLevel) }}>
                      {node.noiseLevel.toFixed(1)} dB
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

          </MapContainer>
        </div>
      </main>

    </div>
  );
}

export default App;