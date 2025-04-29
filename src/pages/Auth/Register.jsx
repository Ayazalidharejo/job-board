import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Ensure you've imported these CSS files in your main application file
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import 'animate.css/animate.min.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    adminAccessKey: '',
    agreeToTerms: false
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [adminKeyVisible, setAdminKeyVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [animateElements, setAnimateElements] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  
  const { register, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations after component mount
    setTimeout(() => {
      setAnimateElements(true);
    }, 100);
    
    // Password strength checker
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 1;
      if (/[A-Z]/.test(formData.password)) strength += 1;
      if (/[0-9]/.test(formData.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    // Clear specific error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    }
    
    if (step === 2) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (step === 3) {
      if (formData.role === 'admin' && !formData.adminAccessKey) {
        newErrors.adminAccessKey = 'Admin key is required';
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      const success = await register(formData);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleAdminKeyVisibility = () => {
    setAdminKeyVisible(!adminKeyVisible);
  };
  
  const getPasswordStrengthClass = () => {
    if (passwordStrength === 0) return 'bg-danger';
    if (passwordStrength === 1) return 'bg-danger';
    if (passwordStrength === 2) return 'bg-warning';
    if (passwordStrength === 3) return 'bg-info';
    if (passwordStrength === 4) return 'bg-success';
  };
  
  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Medium';
    if (passwordStrength === 3) return 'Strong';
    if (passwordStrength === 4) return 'Very Strong';
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Card with floating effect */}
            <div className={`card border-0 shadow-lg rounded-4 overflow-hidden ${animateElements ? 'animate__animated animate__fadeIn' : ''}`} 
                style={{ 
                  transition: 'all 0.3s ease',
                  transform: animateElements ? 'translateY(0)' : 'translateY(20px)'
                }}>
              <div className="row g-0">
                {/* Left side image/brand section */}
                <div className="col-lg-5 d-none d-lg-block" style={{ 
                  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                  position: 'relative'
                }}>
                  <div className="d-flex flex-column h-100 p-5 text-white justify-content-between">
                    <div className={`brand ${animateElements ? 'animate__animated animate__fadeInLeft animate__delay-1s' : ''}`}>
                      <h1 className="fw-bold mb-0">Brand</h1>
                      <p className="text-white-50 mb-0">Your tagline here</p>
                    </div>
                    
                    <div className={`text-center ${animateElements ? 'animate__animated animate__fadeInUp animate__delay-2s' : ''}`}>
                      <div className="mb-5">
                        <i className="bi bi-shield-check display-1"></i>
                        <h2 className="mt-4 fw-bold">Secure Registration</h2>
                        <p className="lead text-white-50">Join thousands of satisfied users today</p>
                      </div>
                      
                      <div className="d-flex justify-content-center mt-4">
                        <span className="px-2 text-white-50"><i className="bi bi-check-circle-fill me-2"></i>Free trial</span>
                        <span className="px-2 text-white-50"><i className="bi bi-check-circle-fill me-2"></i>No credit card</span>
                      </div>
                    </div>
                    
                    <div className={`testimonial ${animateElements ? 'animate__animated animate__fadeIn animate__delay-3s' : ''}`}>
                      <p className="fst-italic">"This platform has completely transformed how we work. Highly recommended!"</p>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-2" 
                            style={{ width: '30px', height: '30px' }}>
                          JD
                        </div>
                        <span>Jane Doe, CEO</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* SVG waves background */}
                  <div className="position-absolute bottom-0 start-0 w-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                      <path fill="rgba(255,255,255,0.1)" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,202.7C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                  </div>
                </div>
                
                {/* Right side form section */}
                <div className="col-lg-7">
                  <div className="card-body p-4 p-lg-5">
                    <div className="text-center mb-4">
                      <h2 className={`fw-bold ${animateElements ? 'animate__animated animate__fadeInDown' : ''}`}>Create Your Account</h2>
                      <p className={`text-muted ${animateElements ? 'animate__animated animate__fadeIn animate__delay-1s' : ''}`}>
                        Step {currentStep} of 3
                      </p>
                      
                      {/* Progress bar */}
                      <div className="progress mb-4" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated" 
                          role="progressbar" 
                          style={{ 
                            width: `${(currentStep / 3) * 100}%`,
                            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
                          }}
                          aria-valuenow={(currentStep / 3) * 100} 
                          aria-valuemin="0" 
                          aria-valuemax="100">
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className={`alert alert-danger d-flex align-items-center ${animateElements ? 'animate__animated animate__shakeX' : ''}`} role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>{error}</div>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="needs-validation">
                      {/* Step 1: Basic Info */}
                      {currentStep === 1 && (
                        <div className={animateElements ? 'animate__animated animate__fadeIn' : ''}>
                          <div className="mb-4">
                            <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                            <div className={`input-group input-group-lg ${errors.name ? 'has-validation' : ''}`}>
                              <span className="input-group-text border-0 bg-light text-primary">
                                <i className="bi bi-person-fill"></i>
                              </span>
                              <input
                                type="text"
                                className={`form-control form-control-lg bg-light border-0 ${errors.name ? 'is-invalid' : ''}`}
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                              />
                              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                            <div className={`input-group input-group-lg ${errors.email ? 'has-validation' : ''}`}>
                              <span className="input-group-text border-0 bg-light text-primary">
                                <i className="bi bi-envelope-fill"></i>
                              </span>
                              <input
                                type="email"
                                className={`form-control form-control-lg bg-light border-0 ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                              />
                              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-end mt-5">
                            <button 
                              type="button" 
                              className="btn btn-lg btn-primary px-5 rounded-pill"
                              onClick={nextStep}
                              style={{ 
                                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                                border: 'none'
                              }}
                            >
                              Continue <i className="bi bi-arrow-right ms-2"></i>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Step 2: Password */}
                      {currentStep === 2 && (
                        <div className={animateElements ? 'animate__animated animate__fadeIn' : ''}>
                          <div className="mb-4">
                            <label htmlFor="password" className="form-label fw-semibold">Password</label>
                            <div className={`input-group input-group-lg ${errors.password ? 'has-validation' : ''}`}>
                              <span className="input-group-text border-0 bg-light text-primary">
                                <i className="bi bi-lock-fill"></i>
                              </span>
                              <input
                                type={passwordVisible ? "text" : "password"}
                                className={`form-control form-control-lg bg-light border-0 ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                              />
                              <button 
                                className="input-group-text bg-light border-0 text-primary" 
                                type="button"
                                onClick={togglePasswordVisibility}
                              >
                                <i className={`bi ${passwordVisible ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                              </button>
                              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            
                            {/* Password strength meter */}
                            {formData.password && (
                              <div className="mt-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <small>Password Strength</small>
                                  <small className={`fw-bold text-${passwordStrength > 2 ? 'success' : passwordStrength > 1 ? 'warning' : 'danger'}`}>
                                    {getPasswordStrengthText()}
                                  </small>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                  <div 
                                    className={`progress-bar ${getPasswordStrengthClass()}`} 
                                    role="progressbar" 
                                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                    aria-valuenow={(passwordStrength / 4) * 100} 
                                    aria-valuemin="0" 
                                    aria-valuemax="100">
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Password should contain uppercase, lowercase, numbers, and special characters
                                  </small>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                            <div className={`input-group input-group-lg ${errors.confirmPassword ? 'has-validation' : ''}`}>
                              <span className="input-group-text border-0 bg-light text-primary">
                                <i className="bi bi-shield-lock-fill"></i>
                              </span>
                              <input
                                type={passwordVisible ? "text" : "password"}
                                className={`form-control form-control-lg bg-light border-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                              />
                              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between mt-5">
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary px-4 rounded-pill"
                              onClick={prevStep}
                            >
                              <i className="bi bi-arrow-left me-2"></i> Back
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-lg btn-primary px-5 rounded-pill"
                              onClick={nextStep}
                              style={{ 
                                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                                border: 'none'
                              }}
                            >
                              Continue <i className="bi bi-arrow-right ms-2"></i>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Step 3: Role & Final */}
                      {currentStep === 3 && (
                        <div className={animateElements ? 'animate__animated animate__fadeIn' : ''}>
                          <div className="mb-4">
                            <label htmlFor="role" className="form-label fw-semibold">Account Type</label>
                            <div className="row g-2 mt-2">
                              <div className="col-6">
                                <div 
                                  className={`card border ${formData.role === 'user' ? 'border-primary' : 'border-light'} rounded-3 p-3 h-100 ${formData.role === 'user' ? 'bg-primary bg-opacity-10' : 'bg-light'}`}
                                  onClick={() => setFormData({...formData, role: 'user'})}
                                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                >
                                  <div className="d-flex align-items-center">
                                    <div className={`rounded-circle me-3 d-flex align-items-center justify-content-center ${formData.role === 'user' ? 'bg-primary text-white' : 'bg-secondary bg-opacity-10'}`} style={{ width: '40px', height: '40px' }}>
                                      <i className="bi bi-person"></i>
                                    </div>
                                    <div>
                                      <h6 className="mb-0 fw-bold">User</h6>
                                      <small className="text-muted">Standard access</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div 
                                  className={`card border ${formData.role === 'admin' ? 'border-primary' : 'border-light'} rounded-3 p-3 h-100 ${formData.role === 'admin' ? 'bg-primary bg-opacity-10' : 'bg-light'}`}
                                  onClick={() => setFormData({...formData, role: 'admin'})}
                                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                >
                                  <div className="d-flex align-items-center">
                                    <div className={`rounded-circle me-3 d-flex align-items-center justify-content-center ${formData.role === 'admin' ? 'bg-primary text-white' : 'bg-secondary bg-opacity-10'}`} style={{ width: '40px', height: '40px' }}>
                                      <i className="bi bi-shield"></i>
                                    </div>
                                    <div>
                                      <h6 className="mb-0 fw-bold">Admin</h6>
                                      <small className="text-muted">Full access</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {formData.role === 'admin' && (
                            <div className="mb-4">
                              <label htmlFor="adminAccessKey" className="form-label fw-semibold">Admin Access Key</label>
                              <div className={`input-group input-group-lg ${errors.adminAccessKey ? 'has-validation' : ''}`}>
                                <span className="input-group-text border-0 bg-light text-primary">
                                  <i className="bi bi-key-fill"></i>
                                </span>
                                <input
                                  type={adminKeyVisible ? "text" : "password"}
                                  className={`form-control form-control-lg bg-light border-0 ${errors.adminAccessKey ? 'is-invalid' : ''}`}
                                  id="adminAccessKey"
                                  name="adminAccessKey"
                                  value={formData.adminAccessKey}
                                  onChange={handleChange}
                                  placeholder="Enter admin access key"
                                />
                                <button 
                                  className="input-group-text bg-light border-0 text-primary" 
                                  type="button"
                                  onClick={toggleAdminKeyVisibility}
                                >
                                  <i className={`bi ${adminKeyVisible ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                                </button>
                                {errors.adminAccessKey && <div className="invalid-feedback">{errors.adminAccessKey}</div>}
                              </div>
                            </div>
                          )}
                          
                          <div className={`mb-4 form-check ${errors.agreeToTerms ? 'is-invalid' : ''}`}>
                            <input 
                              type="checkbox" 
                              className="form-check-input" 
                              id="agreeToTerms" 
                              name="agreeToTerms"
                              checked={formData.agreeToTerms}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="agreeToTerms">
                              I agree to the <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
                            </label>
                            {errors.agreeToTerms && <div className="invalid-feedback">{errors.agreeToTerms}</div>}
                          </div>
                          
                          <div className="d-flex justify-content-between mt-5">
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary px-4 rounded-pill"
                              onClick={prevStep}
                            >
                              <i className="bi bi-arrow-left me-2"></i> Back
                            </button>
                            <button 
                              type="submit" 
                              className="btn btn-lg btn-primary px-5 rounded-pill"
                              style={{ 
                                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                                border: 'none'
                              }}
                            >
                              <i className="bi bi-person-plus-fill me-2"></i> Create Account
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Social login options */}
                      {currentStep === 1 && (
                        <div className={`mt-5 ${animateElements ? 'animate__animated animate__fadeIn animate__delay-1s' : ''}`}>
                          <div className="position-relative my-4">
                            <hr />
                            <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                              or sign up with
                            </div>
                          </div>
                          
                          <div className="row g-2">
                            <div className="col">
                              <button type="button" className="btn btn-outline-light w-100 border border-2 d-flex align-items-center justify-content-center py-2 text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google me-2" viewBox="0 0 16 16">
                                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                                </svg>
                                Google
                              </button>
                            </div>
                            <div className="col">
                              <button type="button" className="btn btn-outline-light w-100 border border-2 d-flex align-items-center justify-content-center py-2 text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-apple me-2" viewBox="0 0 16 16">
                                  <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"/>
                                  <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"/>
                                </svg>
                                Apple
                              </button>
                            </div>
                            <div className="col">
                              <button type="button" className="btn btn-outline-light w-100 border border-2 d-flex align-items-center justify-content-center py-2 text-dark">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook me-2" viewBox="0 0 16 16">
                                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                                </svg>
                                Facebook
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>
                    
                    {/* Login link */}
                    <div className="text-center mt-4">
                      <p className="mb-0">
                        Already have an account? <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#6a11cb' }}>Sign In</Link>
                      </p>
                    </div>
                    
                    {/* Features section */}
                    {currentStep === 1 && (
                      <div className="mt-5 pt-4 border-top">
                        <div className="row g-4">
                          <div className="col-md-4 text-center">
                            <div className="feature-icon rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
                                style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #6a11cb20 0%, #2575fc20 100%)' }}>
                              <i className="bi bi-shield-check text-primary fs-4"></i>
                            </div>
                            <h6 className="fw-bold">Secure & Private</h6>
                            <p className="text-muted small">Your data is protected with enterprise-grade security</p>
                          </div>
                          <div className="col-md-4 text-center">
                            <div className="feature-icon rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
                                style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #6a11cb20 0%, #2575fc20 100%)' }}>
                              <i className="bi bi-lightning-charge text-primary fs-4"></i>
                            </div>
                            <h6 className="fw-bold">Fast & Easy</h6>
                            <p className="text-muted small">Set up your account in minutes, not hours</p>
                          </div>
                          <div className="col-md-4 text-center">
                            <div className="feature-icon rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
                                style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #6a11cb20 0%, #2575fc20 100%)' }}>
                              <i className="bi bi-headset text-primary fs-4"></i>
                            </div>
                            <h6 className="fw-bold">24/7 Support</h6>
                            <p className="text-muted small">Our team is available around the clock to help</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
       
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default Register;