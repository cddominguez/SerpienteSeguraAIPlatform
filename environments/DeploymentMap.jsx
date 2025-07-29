import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

export default function DeploymentMap({ deployments }) {
  const position = [20, 0]; // Centered on the world

  const getLineColor = (status) => {
    switch(status) {
      case 'success': return 'green';
      case 'failed': return 'red';
      case 'in_progress': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
      <CardHeader>
        <CardTitle>Global Deployment Activity</CardTitle>
        <CardDescription>Real-time visualization of deployment origins and destinations.</CardDescription>
      </CardHeader>
      <CardContent>
        <MapContainer center={position} zoom={2} style={{ height: '400px', width: '100%' }} className="rounded-lg">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {deployments.map(dep => {
            if (!dep.origin_geo || !dep.destination_geo) return null;
            const origin = [dep.origin_geo.lat, dep.origin_geo.lon];
            const destination = [dep.destination_geo.lat, dep.destination_geo.lon];

            return (
              <React.Fragment key={dep.id}>
                <Marker position={origin}>
                  <Popup>Origin: {dep.origin_geo.country}<br/>Initiator: {dep.initiator_email}</Popup>
                </Marker>
                <Marker position={destination}>
                  <Popup>Destination: {dep.destination_geo.country}<br/>Service: {dep.service_name}</Popup>
                </Marker>
                <Polyline positions={[origin, destination]} color={getLineColor(dep.status)} dashArray="5, 10" />
              </React.Fragment>
            );
          })}
        </MapContainer>
      </CardContent>
    </Card>
  );
}