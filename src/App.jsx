import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from './lib/supabaseClient'

// Фикс для иконок Leaflet в React (важно!)
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

function App() {
  const [attractions, setAttractions] = useState([])

  // Загрузка данных из Supabase при старте
  useEffect(() => {
    fetchAttractions()
  }, [])

  async function fetchAttractions() {
    const { data, error } = await supabase
      .from('attractions')
      .select('*')
    
    if (error) console.log('Ошибка:', error)
    else setAttractions(data)
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MapContainer center={[53.9, 27.56]} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Отрисовка маркеров из базы данных */}
        {attractions.map((spot) => (
          <Marker key={spot.id} position={[spot.latitude, spot.longitude]}>
            <Popup>
              <b>{spot.name}</b><br />
              {spot.category}<br />
              <i>{spot.description}</i>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default App