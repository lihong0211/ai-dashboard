import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DashboardPage from './pages/Dashboard'
import ModelsPage from './pages/Models'
import WorkbenchPage from './pages/Workbench'
import ExperienceCenterPage from './pages/ExperienceCenter'
import PortalPage from './pages/Portal'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="models" element={<ModelsPage />} />
          <Route path="experience">
            <Route index element={<Navigate to="/experience/llm" replace />} />
            <Route path="llm" element={<ExperienceCenterPage tab="llm" />} />
            <Route path="voice" element={<ExperienceCenterPage tab="voice" />} />
            <Route path="video" element={<ExperienceCenterPage tab="video" />} />
            <Route path="computer" element={<ExperienceCenterPage tab="computer" />} />
            <Route path="mobile" element={<ExperienceCenterPage tab="mobile" />} />
          </Route>
          <Route path="workbench" element={<WorkbenchPage />} />
          <Route path="portal" element={<PortalPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
