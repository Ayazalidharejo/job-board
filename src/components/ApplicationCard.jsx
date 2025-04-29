import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ApplicationCard = ({ application, onDelete }) => {
  const { _id, companyName, position, hrManagerName, applicationDate, response, image, feedback } = application;
  const [showModal, setShowModal] = useState(false);

  const formattedDate = new Date(applicationDate).toLocaleDateString();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Accepted</span>;
      case 'rejected': return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>Rejected</span>;
      case 'interviewing': return <span className="badge bg-warning text-dark"><i className="bi bi-person-lines-fill me-1"></i>Interviewing</span>;
      default: return <span className="badge bg-secondary"><i className="bi bi-hourglass-split me-1"></i>Pending</span>;
    }
  };

  return (
    <>
      <div className="card shadow-sm border-0 h-100">
        <div className="row g-0">
          {image && (
            <div className="col-md-4 d-flex align-items-center justify-content-center p-3">
              <img
                src={image}
                className="img-fluid rounded cursor-pointer"
                alt={`${companyName} logo`}
                style={{
                  maxHeight: '100px',
                  objectFit: 'contain',
                  cursor: 'zoom-in',
                  transition: 'transform 0.3s ease-in-out', // Smooth zoom effect on hover
                }}
                onClick={() => setShowModal(true)} // Open modal on click
              />
            </div>
          )}
          <div className={image ? 'col-md-8' : 'col-12'}>
            <div className="card-body d-flex flex-column justify-content-between h-100">
              <div>
                <h5 className="card-title text-primary fw-bold">{companyName}</h5>
                <p className="mb-1"><strong>Position:</strong> {position}</p>
                <p className="mb-1"><strong>HR Manager:</strong> {hrManagerName}</p>
                <p className="mb-1"><strong>Applied on:</strong> {formattedDate}</p>
                <p className="mb-2"><strong>Status:</strong> {getStatusBadge(response)}</p>
                {feedback && (
                  <div className="alert alert-info py-1 px-2 small mb-2">
                    <i className="bi bi-chat-left-quote-fill me-1"></i><strong>Feedback:</strong> {feedback}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-2">
                <Link to={`/applications/edit/${_id}`} className="btn btn-sm btn-outline-primary" title="Edit">
                  <i className="bi bi-pencil-square"> Edit</i>
                </Link>
                <button onClick={() => onDelete(_id)} className="btn btn-sm btn-outline-danger" title="Delete">
                  <i className="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal with zoom feature */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="xl" animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>{companyName} Logo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-dark text-center">
          <img
            src={image}
            alt={`${companyName} Full Logo`}
            className="img-fluid"
            style={{
              maxHeight: '90vh',  // 90% of the viewport height
              maxWidth: '90vw',   // 90% of the viewport width
              objectFit: 'contain',
              cursor: 'zoom-out', // Change cursor when zoomed in
              transition: 'transform 0.3s ease-in-out', // Smooth transition when closing the modal
            }}
            onClick={() => setShowModal(false)} // Close on click
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ApplicationCard;
