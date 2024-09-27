import React, { useState } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal"; // Import React Bootstrap Modal

const Actor = () => {
  const [avatar, setAvatar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);

  // Handler for file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  // Dummy data
  const actors = [
    {
      country: "USA",
      name: "John Doe",
      birthDate: "1980-01-01",
      photo: "https://via.placeholder.com/50",
    },
    {
      country: "UK",
      name: "Jane Smith",
      birthDate: "1990-02-15",
      photo: "https://via.placeholder.com/50",
    },
    // Add more rows as needed
  ];

  // Filter actors based on search term
  const filteredActors = actors.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show modal and set selected actor
  const handleEditClick = (actor) => {
    setSelectedActor(actor);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActor(null);
  };

  return (
    <div className="container-box">
      {/* Sidebar Section*/}
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box">    
        {/* Title Section*/}
        <div className="mt-4 mb-4">
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>CMS Actor</h3>
        </div>

        <div className="card-box">
            <div className="card-body">
            <div className="row">
                {/* Form Fields */}
                <div className="col-md-6">
                <form>
                    <div className="row mb-3">
                    {/* Country Input */}
                    <div className="col-md-4">
                        <label htmlFor="country" className="form-label">
                        Country
                        </label>
                    </div>
                    <div className="col-md-8">
                        <input
                        type="text"
                        id="country"
                        className="form-control"
                        placeholder="Enter country"
                        />
                    </div>
                    </div>

                    <div className="row mb-3">
                    {/* Actor Name Input */}
                    <div className="col-md-4">
                        <label htmlFor="actorName" className="form-label">
                        Actor Name
                        </label>
                    </div>
                    <div className="col-md-8">
                        <input
                        type="text"
                        id="actorName"
                        className="form-control"
                        placeholder="Enter actor name"
                        />
                    </div>
                    </div>

                    <div className="row mb-3">
                    {/* Birth Date Input */}
                    <div className="col-md-4">
                        <label htmlFor="birthDate" className="form-label">
                        Birth Date
                        </label>
                    </div>
                    <div className="col-md-8">
                        <input
                        type="date"
                        id="birthDate"
                        className="form-control"
                        />
                    </div>
                    </div>
                </form>
                </div>

                {/* Avatar Upload */}
                <div className="col-md-4">
                <div className="d-flex flex-column align-items-center">
                    <div className="mb-3">
                    <label htmlFor="avatarUpload" className="form-label">
                        Upload Avatar
                    </label>
                    <input
                        type="file"
                        id="avatarUpload"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    </div>
                    {avatar && (
                    <div className="mt-3">
                        <img
                        src={avatar}
                        alt="Avatar Preview"
                        className="img-fluid rounded"
                        style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                        }}
                        />
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
            <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                border: "#C6A628",
                padding: "10px 20px",
                color: "#000000"
            }}
            placeholder="Search"
            />
        </div>

        <div className="table-responsive mt-4">
            <table className="table-box">
            <thead>
                <tr>
                <th>Country</th>
                <th>Actor Name</th>
                <th>Birth Date</th>
                <th>Photo</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredActors.map((actor, index) => (
                <tr key={index}>
                    <td>{actor.country}</td>
                    <td>{actor.name}</td>
                    <td>{actor.birthDate}</td>
                    <td>
                    <img
                        src={actor.photo}
                        alt="Actor"
                        className="img-fluid rounded"
                        style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        }}
                    />
                    </td>
                    <td>
                    <a
                        href="#"
                        className="text-primary me-2"
                        onClick={() => handleEditClick(actor)}
                    >
                        Edit
                    </a>
                    <span>|  </span>
                    <a href="#" className="text-danger">
                        Delete
                    </a>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Actor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="editCountry" className="form-label">
                Country
              </label>
              <input
                type="text"
                id="editCountry"
                className="form-control"
                defaultValue={selectedActor?.country || ""}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editName" className="form-label">
                Actor Name
              </label>
              <input
                type="text"
                id="editName"
                className="form-control"
                defaultValue={selectedActor?.name || ""}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editBirthDate" className="form-label">
                Birth Date
              </label>
              <input
                type="date"
                id="editBirthDate"
                className="form-control"
                defaultValue={selectedActor?.birthDate || ""}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
          <button className="btn btn-primary">Save Changes</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Actor;
