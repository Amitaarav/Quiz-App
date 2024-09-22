
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Admin from './components/Admin'
import { User } from './components/User'
import './App.css'

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/user' element={<User/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
