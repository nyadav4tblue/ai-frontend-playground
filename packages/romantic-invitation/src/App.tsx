import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminPage } from './routes/AdminPage'
import { DashboardPage } from './routes/DashboardPage'
import { ExpiredPage } from './routes/ExpiredPage'
import { FlowBuilderPage } from './routes/FlowBuilderPage'
import { FlowResponsesPage } from './routes/FlowResponsesPage'
import { HomePage } from './routes/HomePage'
import { LoginPage } from './routes/LoginPage'
import { SignupPage } from './routes/SignupPage'
import { PublicFlowPage } from './routes/PublicFlowPage'
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
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/flows/new"
          element={
            <ProtectedRoute>
              <FlowBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/flows/:id/edit"
          element={
            <ProtectedRoute>
              <FlowBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/flows/:id/responses"
          element={
            <ProtectedRoute>
              <FlowResponsesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/flow/:slug" element={<PublicFlowPage />} />
        <Route path="/expired" element={<ExpiredPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  )
}
