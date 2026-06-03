import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import GaragePage from './pages/GaragePage'
import WinnersPage from './pages/WinnersPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/garage" replace />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/winners" element={<WinnersPage />} />
        <Route path="*" element={<Navigate to="/garage" replace />} />
      </Route>
    </Routes>
  )
}

export default App
