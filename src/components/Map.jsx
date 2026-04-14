import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// 🛠 ВАЖНО: Исправление иконок маркеров для React/Vite
// Без этого кода маркеры могут быть невидимыми (белыми квадратами)
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
  )
}

export default Map
