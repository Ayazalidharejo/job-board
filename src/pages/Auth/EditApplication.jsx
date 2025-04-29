import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const EditApplication = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    hrManagerName: '',
    quantity: 1,
    applicationDate: '',
    image: null
  });

  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(`/api/applications`);
        const application = response.data.applications.find(app => app._id === id);

        if (!application) {
          setError('Application not found');
          return;
        }

        setFormData({
          companyName: application.companyName,
          position: application.position,
          hrManagerName: application.hrManagerName,
          quantity: application.quantity,
          applicationDate: new Date(application.applicationDate).toISOString().split('T')[0],
        });

        if (application.image) {
          setCurrentImage(application.image);
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching application');
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.patch(`/api/applications/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating application');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">
        <i className="bi bi-pencil-square me-2 text-primary"></i>Edit Job Application
      </h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="companyName" className="form-label fw-semibold">Company Name</label>
          <input
            type="text"
            className="form-control"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="position" className="form-label fw-semibold">Position</label>
          <input
            type="text"
            className="form-control"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="hrManagerName" className="form-label fw-semibold">HR Manager Name</label>
          <input
            type="text"
            className="form-control"
            id="hrManagerName"
            name="hrManagerName"
            value={formData.hrManagerName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="quantity" className="form-label fw-semibold">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="applicationDate" className="form-label fw-semibold">Application Date</label>
          <input
            type="date"
            className="form-control"
            id="applicationDate"
            name="applicationDate"
            value={formData.applicationDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="image" className="form-label fw-semibold">Company Logo/Image</label>
          {currentImage && (
            <div className="mb-3">
              <img src={currentImage} alt="Current Logo" className="img-thumbnail" style={{ maxWidth: '200px' }} />
              <p className="text-muted">Current image shown above</p>
            </div>
          )}
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="col-12 text-center mt-4">
          <button type="submit" className="btn btn-primary px-4" disabled={loading}>
            {loading ? 'Updating...' : 'Update Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditApplication;
