import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function AdminPanel({ onClose }) {
  const [selectedPlace, setSelectedPlace] = useState('')
  const [places, setPlaces] = useState([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  // Загружаем список мест при открытии
  useState(() => {
    async function loadPlaces() {
      const { data } = await supabase.from('attractions').select('id, columm_name, image_url')
      if (data) setPlaces(data)
    }
    loadPlaces()
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !selectedPlace) {
      setMessage('❌ Выберите место и файл')
      return
    }

    setUploading(true)
    setMessage('⏳ Загрузка...')

    try {
      // Загружаем файл в Storage
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Получаем публичный URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      // Обновляем запись в базе
      const { error: updateError } = await supabase
        .from('attractions')
        .update({ image_url: publicUrl })
        .eq('id', selectedPlace)

      if (updateError) throw updateError

      setMessage('✅ Фото успешно загружено!')
      
      // Обновляем список
      const { data } = await supabase.from('attractions').select('id, columm_name, image_url')
      if (data) setPlaces(data)
      
    } catch (error) {
      console.error('Ошибка:', error)
      setMessage('❌ Ошибка: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{
        background: 'white', padding: '2rem', borderRadius: '12px',
        width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>📸 Загрузка фото</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'
          }}>✕</button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Выберите место:
          </label>
          <select
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '8px',
              border: '2px solid #e5e7eb', fontSize: '1rem'
            }}
          >
            <option value="">-- Выберите --</option>
            {places.map(place => (
              <option key={place.id} value={place.id}>
                {place.columm_name} {place.image_url ? '✅' : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Выберите фото:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading || !selectedPlace}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '8px',
              border: '2px dashed #e5e7eb', cursor: 'pointer'
            }}
          />
        </div>

        {message && (
          <div style={{
            padding: '1rem', borderRadius: '8px', marginBottom: '1rem',
            background: message.includes('✅') ? '#dcfce7' : '#fee2e2',
            color: message.includes('✅') ? '#166534' : '#991b1b'
          }}>
            {message}
          </div>
        )}

        {uploading && (
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <div className="spinner" style={{ margin: '0 auto 0.5rem' }}></div>
            Загрузка...
          </div>
        )}

        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>💡 Совет:</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
            Оптимальный размер фото: 800x600px. Формат: JPG или PNG.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel