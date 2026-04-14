import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Исправление иконок маркеров
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
  const defaultCenter = [53.9045, 27.5615]
  
  const flyToPosition = selectedPlace 
    ? [selectedPlace.columm_latitude, selectedPlace.columm_longitude]
    : null

  // Дефолтная картинка для попапов
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
            eventHandlers
