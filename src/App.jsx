import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchImages = async (e) => {
    const apikey = import.meta.env.VITE_PIXABAY_API_KEY
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!apikey) {
      console.error('API key is missing!')
      setError('API key is not configured properly')
      console.error('API Key value:', apikey)
      setLoading(false)
      return
    }

    try {
      console.log('Fetching images for query:', query)
      const url = `https://pixabay.com/api/?key=${apikey}&q=${encodeURIComponent(query)}&image_type=photo`
      console.log('Request URL:', url.replace(apikey, 'HIDDEN_KEY'))
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.hits && Array.isArray(data.hits)) {
        setImages(data.hits)
        console.log(`Found ${data.hits.length} images`)
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      setError(`Failed to fetch images: ${error.message}`)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Image Search App</h1>
      <form onSubmit={searchImages} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <img src={image.webformatURL} alt={image.tags} />
            <div className="image-info">
              <p>Photo by: {image.user}</p>
              <p>Likes: {image.likes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
