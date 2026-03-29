import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { GoalProvider } from '@/context/GoalContext'
import { FoodProvider } from '@/context/FoodContext'
import { PlanProvider } from '@/context/PlanContext'
import { Shell } from '@/components/layout/Shell'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AdminPage } from '@/pages/AdminPage'
import { LoginPage } from '@/pages/LoginPage'

function AppRoutes() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Chargement…</p>
        </div>
      </div>
    )
  }

  if (!session) return <LoginPage />

  return (
    <GoalProvider>
      <FoodProvider>
        <PlanProvider>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<DashboardPage />} />
              <Route path="plan/:date?" element={<PlannerPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </PlanProvider>
      </FoodProvider>
    </GoalProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
