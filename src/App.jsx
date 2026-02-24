import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './ProtectedRoute';

//  DASHBOARDS
const UnifiedDashboard = lazy(() => import('./pages/dashboard/UnifiedDashboard'));
const ManagementDashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const EvaluationDashboard = lazy(() => import('./pages/dashboard/evaluation/EvaluationDashboard'));
const IdentityDashboard = lazy(() => import('./pages/dashboard/IdentityHub/IdentityDashboard'));

//  MANAGEMENT
const Projects = lazy(() => import('./pages/adminmanagement/projects/Projects'));
const AllProjects = lazy(() => import('./pages/adminmanagement/projects/AllProjects'));
const Blogs = lazy(() => import('./pages/adminmanagement/blogs/Blogs'));
const ClientsData = lazy(() => import('./pages/adminmanagement/clients/ClientsData'));
const ClientQueries = lazy(() => import('./pages/adminmanagement/queries/ClientQueries'));
const ClientCallbackData = lazy(() => import('./pages/adminmanagement/callback/ClientCallbackData'));
const Tables = lazy(() => import('./components/tables/Tables'));

//  EVALUATION
const AgentEvaluation = lazy(() => import('./pages/evaluation/AgentEvaluation'));
const TLEvaluation = lazy(() => import('./pages/evaluation/TLEvaluation'));
const QAEvaluation = lazy(() => import('./pages/evaluation/QAEvaluation'));
const CenterEvaluation = lazy(() => import('./pages/evaluation/CenterEvaluation'));
const ManageAdmin = lazy(() => import('./pages/evaluation/ManageAdmin'));
const Charts = lazy(() => import('./pages/evaluation/Charts'));

//  IDENTITY
const Overview = lazy(() => import('./pages/identity/Overview'));

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
          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              {/* DEFAULT REDIRECT */}
              <Route index element={<Navigate to="/dashboard/overview" replace />} />

              {/* DASHBOARDS */}
              <Route path="dashboard/overview" element={<UnifiedDashboard />} />
              <Route path="dashboard/management" element={<ManagementDashboard />} />
              <Route path="dashboard/evaluation" element={<EvaluationDashboard />} />
              <Route path="dashboard/identity" element={<IdentityDashboard />} />

              {/* MANAGEMENT */}
              <Route path="management/blogs" element={<Blogs />} />
              <Route path="management/clients" element={<ClientsData />} />
              <Route path="management/projects" element={<Projects />} />
              <Route path="management/all-projects" element={<AllProjects />} />
              <Route path="management/queries" element={<ClientQueries />} />
              <Route path="management/callback" element={<ClientCallbackData />} />
              <Route path="management/tables" element={<Tables />} />

              {/* EVALUATION */}
              <Route path="evaluation/agent" element={<AgentEvaluation />} />
              <Route path="evaluation/tl" element={<TLEvaluation />} />
              <Route path="evaluation/qa" element={<QAEvaluation />} />
              <Route path="evaluation/center" element={<CenterEvaluation />} />
              <Route path="evaluation/admin" element={<ManageAdmin />} />
              <Route path="evaluation/charts" element={<Charts />} />

              {/* IDENTITY */}
              <Route path="identity/overview" element={<Overview />} />

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/dashboard/management" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;