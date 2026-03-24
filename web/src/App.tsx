import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { DataProvider } from './stores/dataStore'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import MyPage from './pages/MyPage'
import ProductPage from './pages/ProductPage'
import DashboardPage from './pages/DashboardPage'
import SegmentationPage from './pages/SegmentationPage'
import './index.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppContent() {
  const [currentUserId, setCurrentUserId] = useState<string>()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-organic">
      <ScrollToTop />
      <Header currentUserId={currentUserId} onUserChange={setCurrentUserId} onCategoryChange={setActiveCategory} activeCategory={activeCategory} />
      <Routes>
        <Route path="/" element={<HomePage categoryFilter={activeCategory} onCategoryChange={setActiveCategory} />} />
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
