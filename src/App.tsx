import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoalProvider } from '@/context/GoalContext'
import { FoodProvider } from '@/context/FoodContext'
import { PlanProvider } from '@/context/PlanContext'
import { Shell } from '@/components/layout/Shell'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { SettingsPage } from '@/pages/SettingsPage'

export default function App() {
  return (
    <GoalProvider>
      <FoodProvider>
        <PlanProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Shell />}>
                <Route index element={<DashboardPage />} />
                <Route path="plan/:date?" element={<PlannerPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PlanProvider>
      </FoodProvider>
    </GoalProvider>
  )
}
