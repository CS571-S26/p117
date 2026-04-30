import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import SiteFooter from './components/SiteFooter'
import SiteNavbar from './components/SiteNavbar'
import { initialPlannerItems, plannerCategories } from './data/mockData'
import CalendarPage from './pages/CalendarPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  comparePlannerItems,
  createPlannerItem,
} from './utils/planner'

const AUTH_STORAGE_KEY = 'aiPlannerLoggedIn'

function loadLoggedIn() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

function loadPlannerItems() {
  if (typeof window === 'undefined') {
    return initialPlannerItems
  }

  const savedItems =
    window.localStorage.getItem(STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_STORAGE_KEY)

  if (!savedItems) {
    return initialPlannerItems
  }

  try {
    const parsedItems = JSON.parse(savedItems)
    return Array.isArray(parsedItems) ? parsedItems : initialPlannerItems
  } catch {
    return initialPlannerItems
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(loadLoggedIn)
  const [plannerItems, setPlannerItems] = useState(() =>
    loadPlannerItems().sort(comparePlannerItems),
  )

  useEffect(() => {
    if (isLoggedIn) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [isLoggedIn])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerItems))
  }, [plannerItems])

  const visiblePlannerItems = isLoggedIn ? plannerItems : initialPlannerItems

  const upcomingItems = useMemo(
    () =>
      [...visiblePlannerItems]
        .filter((item) => !item.completed)
        .sort(comparePlannerItems)
        .slice(0, 4),
    [visiblePlannerItems],
  )

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleAddItem = (draft) => {
    if (!isLoggedIn) {
      return null
    }

    const newItem = createPlannerItem(draft)
    setPlannerItems((currentItems) =>
      [...currentItems, newItem].sort(comparePlannerItems),
    )
    return newItem
  }

  const handleToggleItem = (itemId) => {
    if (!isLoggedIn) {
      return
    }

    setPlannerItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      ),
    )
  }

  const handleDeleteItem = (itemId) => {
    if (!isLoggedIn) {
      return
    }

    setPlannerItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    )
  }

  return (
    <div className="app-shell">
      <SiteNavbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                items={visiblePlannerItems}
                upcomingItems={upcomingItems}
                categories={plannerCategories}
              />
            }
          />
          <Route
            path="/login"
            element={<LoginPage isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
          />
          <Route
            path="/calendar"
            element={
              <CalendarPage
                items={visiblePlannerItems}
                categories={plannerCategories}
                isLoggedIn={isLoggedIn}
                onToggleItem={handleToggleItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={handleAddItem}
              />
            }
          />
          <Route path="/create" element={<Navigate to="/calendar?create=1" replace />} />
          <Route path="/planner" element={<Navigate to="/calendar" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
