// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';


// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const { login, error } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 300);
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await login(formData.email, formData.password);
//     if (success) {
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <div className={`login-container d-flex justify-content-center align-items-center vh-100 ${loading ? 'fade-in' : ''}`}>
//       <div className="login-card bg-white p-5 rounded shadow-lg">
//         <h2 className="login-title text-center text-primary mb-4 fw-bold">
//           <i className="bi bi-fingerprint me-2"></i> Authentication Required
//         </h2>
//         {error && <div className="alert alert-danger">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="email" className="form-label login-label fw-semibold text-secondary">
//               <i className="bi bi-envelope-at me-1"></i> Email Address
//             </label>
//             <input
//               type="email"
//               className="form-control form-control-lg login-input border-0 shadow-sm"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your professional email"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="form-label login-label fw-semibold text-secondary">
//               <i className="bi bi-key me-1"></i> Password
//             </label>
//             <input
//               type="password"
//               className="form-control form-control-lg login-input border-0 shadow-sm"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Your confidential password"
//               required
//             />
//           </div>
//           <div className="d-grid">
//             <button
//               type="submit"
//               className="login-button btn btn-primary btn-lg rounded-pill shadow-lg"
//             >
//               <i className="bi bi-check-circle-fill me-2"></i> Secure Sign In
//             </button>
//           </div>
//         </form>
//         <hr className="login-divider my-4 opacity-50" />
//         <p className="login-footer text-center text-muted small">
//           Need an account?{' '}
//           <Link to="/register" className="login-link text-decoration-none text-primary fw-semibold">
//             Join our community
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;







import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [loginInProgress, setLoginInProgress] = useState(false);
  
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';
  
  // Effect for initial animation
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);
  
  // Effect to handle redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginInProgress(true);
    
    try {
      console.log('Submitting login form...');
      const success = await login(formData.email, formData.password);
      
      if (success) {
        console.log('Login successful, redirecting to:', from);
        navigate(from, { replace: true });
      } else {
        setLoginInProgress(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginInProgress(false);
    }
  };

  return (
    <div className={`login-container d-flex justify-content-center align-items-center vh-100 ${loading ? 'fade-in' : ''}`}>
      <div className="login-card bg-white p-5 rounded shadow-lg">
        <h2 className="login-title text-center text-primary mb-4 fw-bold">
          <i className="bi bi-fingerprint me-2"></i> Authentication Required
        </h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label login-label fw-semibold text-secondary">
              <i className="bi bi-envelope-at me-1"></i> Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg login-input border-0 shadow-sm"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your professional email"
              required
              disabled={loginInProgress}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="form-label login-label fw-semibold text-secondary">
              <i className="bi bi-key me-1"></i> Password
            </label>
            <input
              type="password"
              className="form-control form-control-lg login-input border-0 shadow-sm"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your confidential password"
              required
              disabled={loginInProgress}
            />
          </div>
          
          <div className="d-grid">
            <button
              type="submit"
              className="login-button btn btn-primary btn-lg rounded-pill shadow-lg"
              disabled={loginInProgress}
            >
              {loginInProgress ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill me-2"></i> Secure Sign In
                </>
              )}
            </button>
          </div>
        </form>
        
        <hr className="login-divider my-4 opacity-50" />
        
        <p className="login-footer text-center text-muted small">
          Need an account?{' '}
          <Link to="/register" className="login-link text-decoration-none text-primary fw-semibold">
            Join our community
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;