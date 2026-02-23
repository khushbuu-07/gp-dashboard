import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';

// Lazy load pages for performance
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Projects = lazy(() => import('./pages/projects/Projects'));
const AllProjects = lazy(() => import('./pages/projects/AllProjects'));
const Blogs = lazy(() => import('./pages/blogs/Blogs'));
const Tables = lazy(() => import('./components/tables/Tables'));
const ClientQueries = lazy(() => import('./pages/queries/ClientQueries'));
const ClientsData = lazy(() => import('./pages/clients/ClientsData'));
const ClientCallbackData = lazy(() => import('./pages/callback/ClientCallbackData'));

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-dark-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes wrapped in MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients-data" element={<ClientsData />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="all-projects" element={<AllProjects />} />
            <Route path="tables" element={<Tables />} />
            <Route path="client-callback-data" element={<ClientCallbackData />} />
            <Route path="queries" element={<ClientQueries />} />
            <Route path="projects" element={<Projects />} />

            {/* Fallback for undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
