import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ApplicationCard from '../../components/ApplicationCard';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/api/applications');
        setApplications(response.data.applications);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/applications/${id}`);
      setApplications(applications.filter(app => app._id !== id));
    } catch (err) {
      setError(err.response?.data?.msg || 'Error deleting application');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="text-secondary">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
          <i className="bi bi-exclamation-octagon-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-semibold text-dark">
          <i className="bi bi-briefcase-fill text-primary me-2"></i>Your Job Applications
        </h2>
        <Link to="/applications/new" className="btn btn-outline-primary btn-lg">
          <i className="bi bi-plus-circle me-2"></i> Add Application
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-folder-x text-muted" style={{ fontSize: '3rem' }}></i>
          <h4 className="mt-3 text-muted">No applications yet</h4>
          <p className="text-secondary">Click the button above to create your first job application.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {applications.map(application => (
            <div className="col" key={application._id}>
              <ApplicationCard
                application={application}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
// change