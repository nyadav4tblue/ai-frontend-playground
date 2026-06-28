import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import { EnhancedNavigation } from './components/EnhancedNavigation'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

// The floating marketing nav only belongs on the public landing page.
// Authenticated pages (dashboard, admin, flow builder/responses) render their
// own <TopNav />, and login/signup/public-flow pages need no marketing nav.
const marketingNavPages = ['/']

export default function App() {
  const location = useLocation()
  const showNav = marketingNavPages.includes(location.pathname)

  return (
    <QueryClientProvider client={queryClient}>
      {/* Enhanced Navigation — stays mounted across route changes */}
      {showNav && <EnhancedNavigation />}

      <Routes location={location}>
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
