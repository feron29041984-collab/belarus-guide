import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

function Sidebar({ onSelect, selectedId }) {
  const [attractions, setAttractions] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
      
      if (error) {
        console.error('Ошибка загрузки:', error)
      } else {
        // Сортируем: сначала те, у которых есть фото
        const sortedData = (data || []).sort((a, b) => {
          return (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0)
        })
        setAttractions(sortedData)
        setFiltered(sortedData)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    let result = attractions

    if (search) {
      result = result.filter(a => 
        (a.columm_name || '').toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== 'all') {
      result = result.filter(a => a.category === category)
    }

    setFiltered(result)
  }, [search, category, attractions])

  const categories = ['all', ...new Set(attractions.map(a => a.category).filter(Boolean))]

  const handleClick = (place) => {
    if (onSelect) onSelect(place)
  }

  // Дефолтная картинка-заглушка
  const defaultImage = "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop"

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🇧🇾 BelarusGuide</h2>
        <p className="subtitle">Откройте для себя Беларусь</p>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Поиск места..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">Все категории</option>
          {categories.filter(c => c !== 'all').map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="stats">
        Найдено: <strong>{filtered.length}</strong> мест
      </div>

      <div className="attractions-list">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Загрузка...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <span style={{fontSize: '2rem'}}>🔍</span>
            <p>Ничего не найдено</p>
          </div>
        ) : (
          filtered.map((place) => (
            <div
              key={place.id}
              className={`card ${selectedId === place.id ? 'card-active' : ''}`}
              onClick={() => handleClick(place)}
            >
              <div className="card-image-wrapper">
                <img 
                  src={place.image_url || defaultImage} 
                  alt={place.columm_name}
                  className="card-image"
                  onError={(e) => {
                    e.target.src = defaultImage
                  }}
                />
                {place.category && (
                  <span className="card-badge">{place.category}</span>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{place.columm_name}</h3>
                {place.description && (
                  <p className="card-desc">
                    {place.description.length > 80 
                      ? place.description.substring(0, 80) + '...' 
                      : place.description}
                  </p>
                )}
                <div className="card-footer">
                  <span className="card-location">📍 Беларусь</span>
                  <span className="card-arrow">→</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Sidebar