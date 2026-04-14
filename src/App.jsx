import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MapContainer 
        center={[53.9, 27.56]} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
      </MapContainer>
    </div>
  )
}

export default App
