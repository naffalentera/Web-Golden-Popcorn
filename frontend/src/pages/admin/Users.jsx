import React, { useState } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal"; // Import React Bootstrap Modal

const Users = () => {
  const [newUser, setNewUser] = useState({ username: "", email: "" });
  const [users, setUsers] = useState([
    { username: "anita1", email: "anita@gmail.com", firstEmailSent: false },
    { username: "borang", email: "bora@yahoo.com", firstEmailSent: false },
    // Add more users as needed
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (newUser.username && newUser.email) {
      setUsers([...users, { ...newUser, firstEmailSent: false }]);
      setNewUser({ username: "", email: "" });
    }
  };

  // Send first email
  const handleSendFirstEmail = (user) => {
    const updatedUsers = users.map((u) =>
      u === user ? { ...u, firstEmailSent: true } : u
    );
    setUsers(updatedUsers);
    alert(`First email sent to ${user.email}`);
  };

  // Show modal and set selected user for editing
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Save changes made to the user
  const handleSaveChanges = () => {
    const updatedUsers = users.map((user) =>
      user === selectedUser ? { ...user, ...selectedUser } : user
    );
    setUsers(updatedUsers);
    handleCloseModal();
  };

  return (
    <div className="container-box">
      {/* Sidebar Section */}
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box">    
        {/* Title Section */}
        <div className="mt-4 mb-4">
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>CMS Users</h3>
        </div>

        {/* Form Section */}
        <div className="d-flex justify-content-start mt-4">
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px",
              width: "250px",
            }}
            placeholder="Enter username"
          />
          <input
            type="text"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px",
              width: "250px",
            }}
            placeholder="Enter email"
          />
          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#C6A628", borderColor: "#C6A628" }}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        {/* Users Table */}
        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>No</th> {/* Kolom No */}
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {!user.firstEmailSent ? (
                      <a
                        href="#"
                        className="text-primary me-2"
                        onClick={() => handleSendFirstEmail(user)}
                      >
                        Send first email
                      </a>
                    ) : (
                      <span className="text-muted me-2">Email sent</span>
                    )}
                    <span>| </span>
                    <a
                      href="#"
                      className="text-primary me-2"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </a>
                    <span>| </span>
                    <a
                      href="#"
                      className="text-danger"
                      onClick={() => setUsers(users.filter(u => u !== user))}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Editing User */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="editUsername" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="editUsername"
                className="form-control"
                value={selectedUser?.username || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, username: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editEmail" className="form-label">
                Email
              </label>
              <input
                type="text"
                id="editEmail"
                className="form-control"
                value={selectedUser?.email || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
