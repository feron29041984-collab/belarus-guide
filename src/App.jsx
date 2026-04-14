<<<<<<< Updated upstream
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
=======
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

// Импорт компонентов
import Sidebar from './components/Sidebar'
import Map from './components/Map'
import AdminPanel from './components/AdminPanel'

// Импорт стилей (обязательно для красивых карточек)
import './index.css'

function App() {
  // Состояние для списка мест
  const [places, setPlaces] = useState([])
  // Состояние для выбранного места (для подсветки)
  const [selectedPlace, setSelectedPlace] = useState(null)
  // Состояние для открытия/закрытия панели загрузки фото
  const [showAdmin, setShowAdmin] = useState(false)

  // Загрузка данных при старте приложения
  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('attractions')
          .select('*')
        
        if (error) {
          console.error('Ошибка Supabase:', error)
        } else {
          console.log('✅ Загружено мест:', data?.length)
          setPlaces(data || [])
        }
      } catch (e) {
        console.error('❌ Ошибка загрузки:', e)
      }
    }
    fetchData()
  }, [])

  // Обработчик клика по карточке в сайдбаре
  const handleSelect = (place) => {
    setSelectedPlace(place)
  }

  // Обработчик клика по маркеру на карте
  const handleMarkerClick = (place) => {
    setSelectedPlace(place)
  }

  return (
    <div id="root">
      {/* 1. Боковая панель (Список мест) */}
      <Sidebar 
        onSelect={handleSelect} 
        selectedId={selectedPlace?.id} 
      />

      {/* 2. Контейнер для Карты */}
      <div className="map-wrapper">
        <Map 
          places={places} 
          selectedPlace={selectedPlace}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* 3. Кнопка открытия панели администратора (внизу справа) */}
      <button 
        className="admin-toggle-btn"
        onClick={() => setShowAdmin(true)}
        title="Загрузить фото"
      >
        📸
      </button>

      {/* 4. Модальное окно загрузки фото */}
      {showAdmin && (
        <AdminPanel 
          places={places} 
          onClose={() => setShowAdmin(false)} 
        />
      )}
>>>>>>> Stashed changes
    </div>
  )
}

export default App