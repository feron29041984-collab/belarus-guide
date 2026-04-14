import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import Sidebar from './components/Sidebar'
import Map from './components/Map'
import AdminPanel from './components/AdminPanel'
import './index.css'

function App() {
  const [places, setPlaces] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('attractions')
          .select('*')
        
        if (error) {
          console.error('Ошибка Supabase:', error)
        } else {
          setPlaces(data || [])
        }
      } catch (e) {
        console.error('Ошибка загрузки:', e)
      }
    }
    fetchData()
  }, [])

  const handleSelect = (place) => setSelectedPlace(place)
  const handleMarkerClick = (place) => setSelectedPlace(place)

  return (
    <div id="root">
      <Sidebar 
        onSelect={handleSelect} 
        selectedId={selectedPlace?.id} 
      />
      <div className="map-wrapper">
        <Map 
          places={places} 
          selectedPlace={selectedPlace}
          onMarkerClick={handleMarkerClick}
        />
      </div>
      <button 
        className="admin-toggle-btn"
        onClick={() => setShowAdmin(true)}
        title="Загрузить фото"
      >
        📸
      </button>
      {showAdmin && (
        <AdminPanel 
          places={places} 
          onClose={() => setShowAdmin(false)} 
        />
      )}
    </div>
  )
}

export default App
