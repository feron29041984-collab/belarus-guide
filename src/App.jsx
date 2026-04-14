import { useState } from 'react'
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import './index.css'

function App() {
  const [selectedAttraction, setSelectedAttraction] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)
  
  // Обработчик выбора из списка
  const handleAttractionSelect = (spot) => {
    setSelectedAttraction(spot.id)
    setMapCenter([spot.latitude, spot.longitude])
  }
  
  // Обработчик клика на маркер
  const handleMarkerClick = (lat, lng, name) => {
    setMapCenter([lat, lng])
    // Можно добавить поиск по имени в sidebar
  }
  
  return (
    <div>
      <header className="header">
        <h1>🇾 BelarusGuide</h1>
        <div style={{ color: '#7f8c8d' }}>
          Интерактивная карта достопримечательностей
        </div>
      </header>
      
      <Sidebar 
        onAttractionSelect={handleAttractionSelect}
        selectedId={selectedAttraction}
      />
      
      <div className="map-container">
        <Map onMarkerClick={handleMarkerClick} />
      </div>
    </div>
  )
}

export default App
