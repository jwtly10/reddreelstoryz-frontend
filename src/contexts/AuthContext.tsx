import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextProps {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async (email: string, password: string): Promise<void> => {
    console.log('Logging in')

    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Implement your login logic here
    // Send a request to your Java server to authenticate the user and obtain a JWT
    // If successful, set isAuthenticated to true
    setIsAuthenticated(true)
  }

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    console.log('Signing up')
    await new Promise((resolve) => setTimeout(resolve, 5000))
    setIsAuthenticated(true)
  }

  const logout = () => {
    // Implement your logout logic here
    // Send a request to your server to invalidate the JWT
    // If successful, set isAuthenticated to false
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
