import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ExperienceCenterPage from './pages/ExperienceCenter'
import PortalPage from './pages/Portal'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="experience">
            <Route index element={<Navigate to="/experience/llm" replace />} />
            <Route path="llm" element={<ExperienceCenterPage tab="llm" />} />
            <Route path="orc" element={<ExperienceCenterPage tab="orc" />} />
            <Route path="tts" element={<ExperienceCenterPage tab="tts" />} />
            <Route path="stt" element={<ExperienceCenterPage tab="stt" />} />
            <Route path="image_generation" element={<ExperienceCenterPage tab="image_generation" />} />
            <Route path="video_understanding" element={<ExperienceCenterPage tab="video_understanding" />} />
          </Route>
          <Route path="skills">
            <Route index element={<Navigate to="/skills/embedding" replace />} />
            <Route path="embedding" element={<ExperienceCenterPage tab="embedding" />} />
            <Route path="rag" element={<ExperienceCenterPage tab="rag" />} />
            <Route path="text2sql" element={<ExperienceCenterPage tab="text2sql" />} />
            <Route path="langchain" element={<ExperienceCenterPage tab="langchain" />} />
            <Route path="function_call" element={<ExperienceCenterPage tab="function_call" />} />
            <Route path="mcp" element={<ExperienceCenterPage tab="mcp" />} />
            <Route path="a2a" element={<ExperienceCenterPage tab="a2a" />} />
            <Route path="agent" element={<ExperienceCenterPage tab="agent" />} />
            <Route path="finetuning" element={<ExperienceCenterPage tab="finetuning" />} />
            <Route path="coze" element={<ExperienceCenterPage tab="coze" />} />
            <Route path="dify" element={<ExperienceCenterPage tab="dify" />} />
            <Route path="knowledge_base" element={<ExperienceCenterPage tab="knowledge_base" />} />
            <Route path="skills" element={<ExperienceCenterPage tab="skills" />} />
          </Route>
          <Route path="portal" element={<PortalPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
