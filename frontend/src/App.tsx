import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import ProtectedRoute from "./components/protected-route"
import Layout from "./components/layout"
import LoginPage from "@/pages/login.tsx";
import RegisterPage from "@/pages/register.tsx";
import HomePage from "@/pages/home.tsx";

function App() {
  return (
      <>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
                path="home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
            />
          </Route>
        </Routes>
        <Toaster />
      </>
  )
}

export default App
