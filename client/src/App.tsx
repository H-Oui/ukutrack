import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import * as React from "react";
import Songs from "./pages/Songs"
import Chords from "./pages/Chords"
import Sessions from "./pages/Sessions"
import Dashboard from "./pages/Dashboard"
import Navbar from "./components/Navbar"


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  return token ? (
      <>
        <Navbar />
        {children}
      </>
  ) : <Navigate to="/login" />
}

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/songs" element={
              <PrivateRoute>
                <Songs />
              </PrivateRoute>
            } />
            <Route path="/chords" element={
              <PrivateRoute>
                <Chords />
              </PrivateRoute>
            } />

            <Route path="/sessions" element={
              <PrivateRoute>
                <Sessions />
              </PrivateRoute>
            } />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  )
}



export default App