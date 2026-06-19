import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminPage } from './routes/AdminPage'
import { DashboardPage } from './routes/DashboardPage'
import { EditInvitationPage } from './routes/EditInvitationPage'
import { ExpiredPage } from './routes/ExpiredPage'
import { HomePage } from './routes/HomePage'
import { InvitationBuilderPage } from './routes/InvitationBuilderPage'
import { LoginPage } from './routes/LoginPage'
import { SignupPage } from './routes/SignupPage'
import { PublicInvitationPage } from './routes/PublicInvitationPage'
import { ProtectedRoute } from './components/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/builder"
          element={
            <ProtectedRoute>
              <InvitationBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit/:id"
          element={
            <ProtectedRoute>
              <EditInvitationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/i/:slug" element={<PublicInvitationPage />} />
        <Route path="/expired" element={<ExpiredPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  )
}
