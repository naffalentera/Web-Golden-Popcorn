import React, { useState } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal"; // Import React Bootstrap Modal

const Genres = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([
    { name: "Action" },
    { name: "Drama" },
    { name: "Comedy" },
    // Add more genres as needed
  ]);

  // Show modal and set selected genre
  const handleEditClick = (genre) => {
    setSelectedGenre(genre);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGenre(null);
  };

  // Save changes made to the genre
  const handleSaveChanges = () => {
    const updatedGenres = genres.map((genre) =>
      genre === selectedGenre ? { ...genre, name: selectedGenre.name } : genre
    );
    setGenres(updatedGenres);
    handleCloseModal();
  };

  // Handle adding a new genre
  const handleAddGenre = () => {
    if (newGenre.trim() !== "") {
      setGenres([...genres, { name: newGenre }]);
      setNewGenre("");
    }
  };

  // Filter genres based on search term
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-box d-flex">
      {/* Sidebar Section */}
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box" style={{ width: "100%" }}>    
        {/* Title Section */}
        <div className="mt-4 mb-4">
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '27px' }}>CMS Genres</h3>
        </div>

        <div className="d-flex justify-content-start mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px",
              width: "250px",
            }}
            placeholder="Search"
          />
          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#C6A628", borderColor: "#C6A628", marginRight: "10px" }}
          >
            Search
          </button>
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px",
              width: "250px",
            }}
            placeholder="Add new genre"
          />
          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#C6A628", borderColor: "#C6A628" }}
            onClick={handleAddGenre}
          >
            Submit
          </button>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>No</th>
                <th>Genres</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGenres.map((genre, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{genre.name}</td>
                  <td>
                    <a
                      href="#"
                      className="text-primary me-2"
                      onClick={() => handleEditClick(genre)}
                    >
                      Edit
                    </a>
                    <span>| </span>
                    <a
                      href="#"
                      className="text-danger"
                      onClick={() => setGenres(genres.filter(g => g !== genre))}
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Genre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="editGenre" className="form-label">
                Genre Name
              </label>
              <input
                type="text"
                id="editGenre"
                className="form-control"
                value={selectedGenre?.name || ""}
                onChange={(e) =>
                  setSelectedGenre({ ...selectedGenre, name: e.target.value })
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

export default Genres;
