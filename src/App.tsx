import { AuthProvider } from './contexts/AuthContext'
import NavbarComponent from './components/NavbarComponent'

function App() {
  return (
    <AuthProvider>
      <NavbarComponent />
    </AuthProvider>
  )
}

export default App
