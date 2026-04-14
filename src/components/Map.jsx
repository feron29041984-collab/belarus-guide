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

  const defaultImage = "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop"

  // Функция-обёртка для клика (избегаем сложного синтаксиса)
  const handleMarkerClick = function(place) {
    if (onMarkerClick) {
      onMarkerClick(place)
    }
  }

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={7} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      
      <FlyTo position={flyToPosition} />
      
      {places && places.map(function(place) {
        const lat = place.columm_latitude
        const lng = place.columm_longitude
        
        if (!lat || !lng) {
          return null
        }
        
        return (
          <Marker 
            key={place.id} 
            position={[lat, lng]}
            eventHandlers={{
              click: function() {
                handleMarkerClick(place)
              }
            }}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div>
                <img 
                  src={place.image_url || defaultImage}
                  alt={place.columm_name}
                  className="popup-image"
                  onError={function(e) {
                    e.target.src = defaultImage
                  }}
                  style={{ 
                    width: '100%', 
                    height: '160px', 
                    objectFit: 'cover', 
                    borderRadius: '8px 8px 0 0' 
                  }}
                />
                <div style={{ padding: '12px' }}>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    color: '#111827'
                  }}>
                    {place.columm_name}
                  </h3>
                  {place.category && (
                    <span style={{ 
                      display: 'inline-block',
                      background: '#dbeafe', 
                      color: '#1e40af', 
                      padding: '4px 10px', 
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}>
                      {place.category}
                    </span>
                  )}
                  {place.description && (
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.9rem', 
                      color: '#4b5563',
                      lineHeight: 1.4
                    }}>
                      {place.description.length > 120 
                        ? place.description.substring(0, 120) + '...' 
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
  )
}

export default Map
