import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/shared/Header';
import { Sidebar } from '@/components/shared/Sidebar';
import { Loading } from '@/components/shared/Loading';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Tasks from '@/pages/Tasks';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Team from '@/pages/Team';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { NotificationProvider } from '@/components/shared/Notification';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4">
              <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                />
                <Route
                  path="/projects"
                  element={<ProtectedRoute><Projects /></ProtectedRoute>}
                />
                <Route
                  path="/projects/:id"
                  element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>}
                />
                <Route
                  path="/tasks"
                  element={<ProtectedRoute><Tasks /></ProtectedRoute>}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />
                <Route
                  path="/settings"
                  element={<ProtectedRoute><Settings /></ProtectedRoute>}
                />
                <Route
                  path="/team"
                  element={<ProtectedRoute><Team /></ProtectedRoute>}
                />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;


