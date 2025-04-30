// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import api from '../utils/api';

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     const storedUser = localStorage.getItem('user');
    
// //     if (token && storedUser) {
// //       setUser(JSON.parse(storedUser));
// //       setIsAuthenticated(true);
// //       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// //     }
    
// //     setLoading(false);
// //   }, []);

// //   const login = async (email, password) => {
// //     try {
// //       setError(null);
// //       const response = await api.post('/api/auth/login', { email, password });
// //       const { user, token } = response.data;
      
// //       localStorage.setItem('token', token);
// //       localStorage.setItem('user', JSON.stringify(user));
      
// //       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
// //       setUser(user);
// //       setIsAuthenticated(true);
// //       return true;
// //     } catch (err) {
// //       setError(err.response?.data?.msg || 'Login failed');
// //       return false;
// //     }
// //   };

// //   const register = async (userData) => {
// //     try {
// //       setError(null);
// //       const response = await api.post('/api/auth/register', userData);
// //       const { user, token } = response.data;
      
// //       localStorage.setItem('token', token);
// //       localStorage.setItem('user', JSON.stringify(user));
      
// //       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
// //       setUser(user);
// //       setIsAuthenticated(true);
// //       return true;
// //     } catch (err) {
// //       setError(err.response?.data?.msg || 'Registration failed');
// //       return false;
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //     delete api.defaults.headers.common['Authorization'];
// //     setUser(null);
// //     setIsAuthenticated(false);
// //   };

// //   const value = {
// //     user,
// //     isAuthenticated,
// //     loading,
// //     error,
// //     login,
// //     register,
// //     logout
// //   };

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // };













// import React, { createContext, useContext, useState, useEffect } from 'react';
// import api from '../utils/api';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Load user from localStorage on initial render
//   useEffect(() => {
//     const loadUser = async () => {
//       const token = localStorage.getItem('token');
//       const storedUser = localStorage.getItem('user');
      
//       if (token && storedUser) {
//         try {
//           setUser(JSON.parse(storedUser));
//           setIsAuthenticated(true);
//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
//           // Optional: Verify token is still valid with the backend
//           // This helps ensure the stored token is still valid
//           try {
//             await api.get('/api/auth/verify');
//           } catch (verifyErr) {
//             // Token is invalid or expired, log the user out
//             logout();
//           }
//         } catch (err) {
//           // Handle any JSON parsing errors
//           logout();
//         }
//       }
      
//       setLoading(false);
//     };

//     loadUser();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setError(null);
//       const response = await api.post('/api/auth/login', { email, password });
//       const { user, token } = response.data;
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
      
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       setUser(user);
//       setIsAuthenticated(true);
//       return true;
//     } catch (err) {
//       setError(err.response?.data?.msg || 'Login failed');
//       return false;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       setError(null);
//       const response = await api.post('/api/auth/register', userData);
//       const { user, token } = response.data;
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
      
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
//       setUser(user);
//       setIsAuthenticated(true);
//       return true;
//     } catch (err) {
//       setError(err.response?.data?.msg || 'Registration failed');
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     delete api.defaults.headers.common['Authorization'];
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     error,
//     login,
//     register,
//     logout
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };






import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Using a ref to prevent logout function dependency issues in useEffect
  const initialized = useRef(false);

  // Define logout as a useCallback to prevent infinite loops
  const logout = useCallback(() => {
    console.log('Logging out user...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (initialized.current) return;
      initialized.current = true;
      
      try {
        console.log('Checking for stored authentication...');
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          console.log('Found stored credentials, restoring session');
          
          try {
            // Parse user and set authentication state BEFORE any API calls
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            
            // Set authorization header for API requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Optionally verify token with backend
            // Uncomment if you have a verify endpoint
            /*
            try {
              console.log('Verifying token with backend...');
              await api.get('/api/auth/verify');
              console.log('Token verified successfully');
            } catch (verifyErr) {
              console.error('Token verification failed:', verifyErr);
              logout();
            }
            */
          } catch (parseErr) {
            console.error('Failed to parse stored user:', parseErr);
            logout();
          }
        } else {
          console.log('No stored credentials found');
        }
      } catch (err) {
        console.error('Error during authentication initialization:', err);
      } finally {
        console.log('Authentication initialization complete');
        setLoading(false);
      }
    };

    loadUser();
    
    // Handle storage events (for multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        console.log('Token removed in another tab');
        logout();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logout]);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Attempting login...');
      const response = await api.post('/api/auth/login', { email, password });
      const { user, token } = response.data;
      
      console.log('Login successful, saving session');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.msg || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('Attempting registration...');
      const response = await api.post('/api/auth/register', userData);
      const { user, token } = response.data;
      
      console.log('Registration successful, saving session');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.msg || 'Registration failed');
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};