import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Applications from './pages/Applications';
import BrowseJobs from './pages/BrowseJobs';
import Profile from './pages/Profile';
import Login from './pages/Login';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Role-based Dashboard Component
const RoleDashboard = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on role
  if (user?.role === 'recruiter') {
    return <RecruiterDashboard />;
  }

  // Default to student/intern dashboard
  return <Dashboard />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<RoleDashboard />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/browse-jobs" element={<BrowseJobs />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
