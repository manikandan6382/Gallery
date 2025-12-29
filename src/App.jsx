import { StrictMode, useState } from 'react'
import GalleryPage from './pages/GalleryPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <GalleryPage /> 
    </>
  )
}

export default App
