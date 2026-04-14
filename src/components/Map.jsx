<<<<<<< Updated upstream
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// 🛠 ВАЖНО: Исправление иконок маркеров для React/Vite
// Без этого кода маркеры могут быть невидимыми (белыми квадратами)
import L from 'leaflet'
=======
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Исправление иконок
>>>>>>> Stashed changes
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

<<<<<<< Updated upstream
// Импорт вашего клиента Supabase (убедитесь, что путь правильный)
import { supabase } from '../lib/supabaseClient'

function Map() {
  const [attractions, setAttractions] = useState([])

  // Загружаем данные при запуске компонента
  useEffect(() => {
    async function fetchData() {
      console.log('Загрузка данных из Supabase...')
      
      const { data, error } = await supabase
        .from('attractions') // Имя вашей таблицы
        .select('*')         // Выбираем все колонки
      
      if (error) {
        console.error('Ошибка при загрузке:', error)
      } else {
        console.log('Данные получены:', data)
        setAttractions(data) // Сохраняем в состояние
      }
    }

    fetchData()
  }, [])

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[53.9045, 27.5615]} // Координаты центра (Минск)
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* 🎈 Рендерим маркеры для каждой достопримечательности */}
        {attractions.map((place) => (
          <Marker 
            key={place.id} 
            position={[place.latitude, place.longitude]} // [Широта, Долгота]
          >
            <Popup>
              <b>{place.name}</b><br />
              <span style={{ 
                background: '#e0e7ff', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontSize: '12px' 
              }}>
                {place.category}
              </span>
              <p style={{ marginTop: '5px', fontSize: '14px' }}>
                {place.description}
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
=======
// Компонент для плавного перемещения карты
function FlyTo({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { duration: 1.5 })
    }
  }, [position, map])
  return null
}

function Map({ places, selectedPlace, onMarkerClick }) {
  useEffect(() => {
    console.log('🗺️ Map получил мест:', places?.length)
  }, [places])

  const defaultCenter = [53.9045, 27.5615]
  
  const flyToPosition = selectedPlace 
    ? [selectedPlace.columm_latitude, selectedPlace.columm_longitude]
    : null

  const defaultImage = "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop"

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={7} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      <FlyTo position={flyToPosition} />
      
      {places && places.map((place) => {
        const lat = place.columm_latitude
        const lng = place.columm_longitude
        
        if (!lat || !lng) return null
        
        return (
          <Marker 
            key={place.id} 
            position={[lat, lng]}
            eventHandlers={{
              click: () => onMarkerClick?.(place)
            }}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div>
                <img 
                  src={place.image_url || defaultImage}
                  alt={place.columm_name}
                  className="popup-image"
                  onError={(e) => { e.target.src = defaultImage }}
                />
                <div className="popup-content">
                  <h3 className="popup-title">{place.columm_name}</h3>
                  {place.category && (
                    <span className="popup-category">{place.category}</span>
                  )}
                  {place.description && (
                    <p className="popup-desc">
                      {place.description.length > 100 
                        ? place.description.substring(0, 100) + '...' 
                        : place.description}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
>>>>>>> Stashed changes
  )
}

export default Map