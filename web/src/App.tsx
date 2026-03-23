import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { DataProvider } from './stores/dataStore'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import MyPage from './pages/MyPage'
import ProductPage from './pages/ProductPage'
import DashboardPage from './pages/DashboardPage'
import SegmentationPage from './pages/SegmentationPage'
import './index.css'

function AppContent() {
  const [currentUserId, setCurrentUserId] = useState<string>()

  return (
    <div className="min-h-screen bg-organic">
      <Header currentUserId={currentUserId} onUserChange={setCurrentUserId} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/my/:userId" element={<MyPage onUserChange={setCurrentUserId} />} />
        <Route path="/product/:name" element={<ProductPage currentUserId={currentUserId} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/segmentation" element={<SegmentationPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </BrowserRouter>
  )
}
