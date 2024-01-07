import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home.tsx'
import History from '../pages/History.tsx'
import NavbarComponent from '../components/NavbarComponent.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'
import Generate from '../pages/Generate.tsx'
import { Footer } from 'antd/es/layout/layout'

export default function AppRouter() {
  const { isAuthenticated } = useAuth()
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path='/' element={<Home />} />
        {isAuthenticated ? (
          <>
            <Route path='/generate' element={<Generate />} />
            <Route path='/history' element={<History />} />
          </>
        ) : (
          <>
            <Route path='/generate' element={<Navigate to='/' />} />
            <Route path='/history' element={<Navigate to='/' />} />
          </>
        )}
      </Routes>
      <Footer style={{ textAlign: 'center' }} className='mt-5'>
        ai-content-generator ©{new Date().getFullYear()}{' '}
      </Footer>
    </BrowserRouter>
  )
}
