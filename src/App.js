// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Register from './pages/Auth/Register';
// import Login from './pages/Auth/Login';
// import Dashboard from './pages/Auth/Dashboard';
// import AdminDashboard from './pages/Admin/AdminDashboard';
// import ApplicationForm from './components/ApplicationForm';
// import EditApplication from './pages//Auth/EditApplication';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Navbar from './components/Navbar';

// // Protected Route Component
// const ProtectedRoute = ({ children, adminRequired }) => {
//   const { isAuthenticated, user } = useAuth();
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
  
//   if (adminRequired && user.role !== 'admin') {
//     return <Navigate to="/dashboard" />;
//   }
  
//   return children;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <div className="container">
//           <Routes>
//             <Route path="/" element={<Navigate to="/login" />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/dashboard" element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } />
//             <Route path="/applications/new" element={
//               <ProtectedRoute>
//                 <ApplicationForm />
//               </ProtectedRoute>
//             } />
//             <Route path="/applications/edit/:id" element={
//               <ProtectedRoute>
//                 <EditApplication />
//               </ProtectedRoute>
//             } />
//             <Route path="/admin" element={
//               <ProtectedRoute adminRequired={true}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             } />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;






// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Register from './pages/Auth/Register';
// import Login from './pages/Auth/Login';
// import Dashboard from './pages/Auth/Dashboard';
// import AdminDashboard from './pages/Admin/AdminDashboard';
// import ApplicationForm from './components/ApplicationForm';
// import EditApplication from './pages/Auth/EditApplication';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Navbar from './components/Navbar';

// // Protected Route Component
// const ProtectedRoute = ({ children, adminRequired }) => {
//   const { isAuthenticated, user, loading } = useAuth();

//   // ✅ Wait until auth is loaded
//   if (loading) return <div className="text-center mt-5">Checking authentication...</div>;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   if (adminRequired && user.role !== 'admin') {
//     return <Navigate to="/dashboard" />;
//   }

//   return children;
// };

// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/login" element={<Login />} />
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/applications/new"
//         element={
//           <ProtectedRoute>
//             <ApplicationForm />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/applications/edit/:id"
//         element={
//           <ProtectedRoute>
//             <EditApplication />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute adminRequired={true}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <div className="container">
//           <AppRoutes />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;





























import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Auth/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ApplicationForm from './components/ApplicationForm';
import EditApplication from './pages/Auth/EditApplication';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// App wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// App content separated to ensure useAuth is used within Router context
function AppContent() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/applications/new" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
          <Route path="/applications/edit/:id" element={<ProtectedRoute><EditApplication /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>
    </>
  );
}

// Route for authenticated users only
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (!isAuthenticated) {
    // Save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

// Route for admin users only
function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Route that redirects to dashboard if already authenticated
function AuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
}

export default App;