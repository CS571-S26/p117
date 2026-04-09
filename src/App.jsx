import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import SiteFooter from './components/SiteFooter'
import SiteNavbar from './components/SiteNavbar'
import HomePage from './pages/HomePage'
import PlannerPage from './pages/PlannerPage'

function App() {
  return (
    <div className="app-shell">
      <SiteNavbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
