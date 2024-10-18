/* eslint-disable no-unused-vars */
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CameraView from './components/CameraView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className = "min-h-screen bg-gray-100">
      <header className = "bg-white shadow-sm">
        <div className = "max-w-7xl mx-auto py-4 px-4">
          <h1 className = "text-2xl font-bold text-gray-900">
            Gesturism
          </h1>
        </div>
      </header>
      <main>
        < CameraView />
      </main>
    </div>
  )
}

export default App
