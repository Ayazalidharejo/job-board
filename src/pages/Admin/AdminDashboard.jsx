import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import UserApplications from './AdminUserApplications';
import { Spinner } from 'react-bootstrap';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/applications/admin/users');
        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (event) => {
    setSelectedUser(event.target.value);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4" style={{ fontSize: '2rem' }}>
        Admin Dashboard
      </h2>

      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <label htmlFor="userSelect" className="form-label fw-semibold">
            Select a User to Manage Applications:
          </label>
          <select
            id="userSelect"
            className="form-select form-select-lg"
            value={selectedUser || ''}
            onChange={handleUserSelect}
          >
            <option value="" disabled>Select a user</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedUser ? (
        <div className="card shadow-sm p-4">
          <h4 className="text-center text-primary mb-3">User Applications</h4>
          <UserApplications userId={selectedUser} />
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <strong>Please select a user from the dropdown above to view their applications.</strong>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
