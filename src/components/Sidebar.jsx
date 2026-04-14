import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

function Sidebar({ onAttractionSelect, selectedId }) {
  const [attractions, setAttractions] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchAttractions()
  }, [])
  
  async function fetchAttractions() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .order('name')
      
      if (error) throw error
      setAttractions(data || [])
    } catch (error) {
      console.error('Ошибка:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Получаем уникальные категории для фильтра
  const categories = ['all', ...new Set(attractions.map(a => a.category).filter(Boolean))]
  
  // Фильтруем достопримечательности
  const filteredAttractions = filter === 'all' 
    ? attractions 
    : attractions.filter(a => a.category === filter)
  
  const handleClick = (spot) => {
    if (onAttractionSelect) {
      onAttractionSelect(spot)
    }
  }
  
  return (
    <div className="sidebar">
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}> Достопримечательности</h2>
        
        {/* Фильтр по категориям */}
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginBottom: '1rem'
          }}
        >
          <option value="all">Все категории</option>
          {categories.filter(c => c !== 'all').map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <div style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '1rem' }}>
          Найдено: {filteredAttractions.length}
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
          Загрузка...
        </div>
      ) : filteredAttractions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
          Ничего не найдено
        </div>
      ) : (
        <div>
          {filteredAttractions.map((spot) => (
            <div 
              key={spot.id}
              className={`attraction-card ${selectedId === spot.id ? 'selected' : ''}`}
              onClick={() => handleClick(spot)}
              style={{
                borderLeft: selectedId === spot.id ? '4px solid #3498db' : '4px solid transparent'
              }}
            >
              <h3>{spot.name}</h3>
              {spot.category && (
                <span className="category">{spot.category}</span>
              )}
              {spot.description && (
                <p>{spot.description.substring(0, 80)}...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Sidebar
