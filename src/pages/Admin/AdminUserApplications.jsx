import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserApplications = ({ userId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editStates, setEditStates] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get(`/api/applications/admin/user/${userId}`);
        setApplications(response.data.applications);

        const initialStates = {};
        response.data.applications.forEach(app => {
          initialStates[app._id] = {
            feedback: app.feedback || '',
            response: app.response || 'pending',
          };
        });
        setEditStates(initialStates);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching applications');
        setLoading(false);
      }
    };

    if (userId) {
      fetchApplications();
    }
  }, [userId]);

  const handleChange = (id, field, value) => {
    setEditStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (applicationId) => {
    const { feedback, response } = editStates[applicationId];

    try {
      const res = await api.patch(`/api/applications/admin/feedback/${applicationId}`, {
        feedback,
        response,
      });

      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, feedback, response } : app
      ));

      toast.success('Feedback submitted successfully!');
    } catch (err) {
      console.error("Feedback submission failed:", err.response || err.message);
      setError(err.response?.data?.msg || 'Error updating feedback');
      toast.error('Failed to submit feedback');
    }
  };

  if (loading) return <div className="text-center my-4">Loading applications...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h3 className="mb-5 text-center text-primary" style={{ fontSize: '2rem' }}>User Applications</h3>
      {applications.length === 0 ? (
        <p className="text-center text-muted" style={{ fontSize: '1.2rem' }}>No applications found for this user.</p>
      ) : (
        applications.map(application => (
          <div key={application._id} className="card mb-5 shadow-lg border-0 rounded-lg">
            <div className="card-body">
              <div className="text-center mb-4">
                <h5 className="card-title text-primary" style={{ fontSize: '1.75rem' }}>
                  {application.companyName} - {application.position}
                </h5>
                <p className="card-text" style={{ fontSize: '1.25rem' }}><strong>HR Manager:</strong> {application.hrManagerName}</p>
                <p className="card-text" style={{ fontSize: '1.25rem' }}><strong>Applied on:</strong> {new Date(application.applicationDate).toLocaleDateString()}</p>
                <p className="card-text" style={{ fontSize: '1.25rem' }}>
                  <strong>Status:</strong>
                  <span className={`badge bg-${application.response === 'accepted' ? 'success' : application.response === 'rejected' ? 'danger' : application.response === 'interviewing' ? 'warning' : 'secondary'}`}>
                    {application.response}
                  </span>
                </p>
              </div>

              {application.image && (
                <div className="mb-4 text-center">
                  <h6 style={{ fontSize: '1.3rem' }}>Application Image:</h6>
                  <img
                    src={application.image}
                    alt="Application"
                    className="img-fluid rounded shadow-sm mb-3"
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                  />
                  <div className="mt-2">
                    <button
                      className="btn btn-link text-primary"
                      data-bs-toggle="modal"
                      data-bs-target={`#imageModal${application._id}`}
                      style={{ fontSize: '1.1rem' }}
                    >
                      View Image
                    </button>

                    {/* Modal for Image Preview */}
                    <div className="modal fade" id={`imageModal${application._id}`} tabIndex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="imageModalLabel">Application Image</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body text-center">
                            <img
                              src={application.image}
                              alt="Application"
                              className="img-fluid rounded"
                              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '1.2rem' }}>Feedback:</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={editStates[application._id]?.feedback || ''}
                  onChange={(e) => handleChange(application._id, 'feedback', e.target.value)}
                  placeholder="Enter feedback..."
                  style={{ fontSize: '1.1rem' }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '1.2rem' }}>Response Status:</label>
                <select
                  className="form-select"
                  value={editStates[application._id]?.response || 'pending'}
                  onChange={(e) => handleChange(application._id, 'response', e.target.value)}
                  style={{ fontSize: '1.1rem' }}
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="interviewing">Interviewing</option>
                </select>
              </div>

              <button
                className="btn btn-success w-100 py-3"
                onClick={() => handleSubmit(application._id)}
                style={{ fontSize: '1.2rem' }}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        ))
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserApplications;
