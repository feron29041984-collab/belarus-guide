import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { supabase } from '../lib/supabaseClient'

// Исправление иконок Leaflet в React
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
})

L.Marker.prototype.options.icon = DefaultIcon

// Компонент для обновления центра карты
function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.5 })
    }
  }, [center, map])
  return null
}

function Map({ onMarkerClick }) {
  const [attractions, setAttractions] = useState([])
  const defaultCenter = [53.9, 27.56] // Минск
  
  // Загрузка данных из Supabase
  useEffect(() => {
    fetchAttractions()
  }, [])
  
  async function fetchAttractions() {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Ошибка загрузки:', error)
        return
      }
      
      setAttractions(data || [])
    } catch (err) {
      console.error('Ошибка:', err)
    }
  }
  
  // Обработчик клика на маркер
  const handleMarkerClick = (lat, lng, name) => {
    if (onMarkerClick) {
      onMarkerClick({ lat, lng, name })
    }
  }
  
  return (
    <>
      {/* Передаем данные вверх для отображения в sidebar */}
      {onMarkerClick && attractions.length > 0 && (
        <div style={{ display: 'none' }}>
          {attractions.map(spot => (
            <div key={spot.id} data-id={spot.id} />
          ))}
        </div>
      )}
      
      <MapContainer 
        center={defaultCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {attractions.map((spot) => (
          <Marker 
            key={spot.id} 
            position={[spot.latitude, spot.longitude]}
            eventHandlers={{
              click: () => handleMarkerClick(spot.latitude, spot.longitude, spot.name),
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{spot.name}</h3>
                {spot.category && (
                  <span style={{ 
                    display: 'inline-block',
                    background: '#3498db', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginBottom: '8px'
                  }}>
                    {spot.category}
                  </span>
                )}
                {spot.description && (
                  <p style={{ margin: '8px 0 0 0', color: '#7f8c8d', fontSize: '14px' }}>
                    {spot.description.substring(0, 100)}...
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

export default Map
