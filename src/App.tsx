import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Intake from './pages/Intake'
import Test from './pages/Test'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

