import React, { useState } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal"; // Import React Bootstrap Modal

const Awards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [awards, setAwards] = useState([
    { country: "Japan", year: 2024, award: "Japanese Drama Awards Spring 2024" },
    { country: "Korea", year: 2024, award: "Korean Drama Awards Spring 2024" },
    // Add more awards as needed
  ]);

  const [newAward, setNewAward] = useState({ country: "", year: "", award: "" });

  // Show modal and set selected award
  const handleEditClick = (award) => {
    setSelectedAward(award);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAward(null);
  };

  // Save changes made to the award
  const handleSaveChanges = () => {
    const updatedAwards = awards.map((award) =>
      award === selectedAward ? { ...award, ...selectedAward } : award
    );
    setAwards(updatedAwards);
    handleCloseModal();
  };

  // Handle adding a new award
  const handleAddAward = () => {
    if (newAward.country.trim() !== "" && newAward.year.trim() !== "" && newAward.award.trim() !== "") {
      setAwards([...awards, { ...newAward }]);
      setNewAward({ country: "", year: "", award: "" });
    }
  };

  // Filter awards based on search term
  const filteredAwards = awards.filter((award) =>
    award.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    award.year.toString().includes(searchTerm) ||
    award.award.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-box">
      {/* Sidebar Section */}
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box">    
        {/* Title Section */}
        <div className="mt-4 mb-4">
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>CMS Awards</h3>
        </div>

        <div className="d-flex justify-content-start mt-4">
          <input
            type="text"
            value={newAward.country}
            onChange={(e) => setNewAward({ ...newAward, country: e.target.value })}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px"
            }}
            placeholder="Enter country"
          />
          <input
            type="text"
            value={newAward.year}
            onChange={(e) => setNewAward({ ...newAward, year: e.target.value })}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px"
            }}
            placeholder="Enter year"
          />
          <input
            type="text"
            value={newAward.award}
            onChange={(e) => setNewAward({ ...newAward, award: e.target.value })}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px"
            }}
            placeholder="Enter award"
          />
          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#C6A628", borderColor: "#C6A628" }}
            onClick={handleAddAward}
          >
            Submit
          </button>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>No</th> {/* Nomor urut */}
                <th>Countries</th>
                <th>Years</th>
                <th>Awards</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAwards.map((award, index) => (
                <tr key={index}>
                  <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                  <td>{award.country}</td>
                  <td>{award.year}</td>
                  <td>{award.award}</td>
                  <td>
                    <a
                      href="#"
                      className="text-primary me-2"
                      onClick={() => handleEditClick(award)}
                    >
                      Edit
                    </a>
                    <span>| </span>
                    <a
                      href="#"
                      className="text-danger"
                      onClick={() => setAwards(awards.filter(a => a !== award))}
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
          <Modal.Title>Edit Award</Modal.Title>
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
                value={selectedAward?.country || ""}
                onChange={(e) =>
                  setSelectedAward({ ...selectedAward, country: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editYear" className="form-label">
                Year
              </label>
              <input
                type="text"
                id="editYear"
                className="form-control"
                value={selectedAward?.year || ""}
                onChange={(e) =>
                  setSelectedAward({ ...selectedAward, year: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editAward" className="form-label">
                Award
              </label>
              <input
                type="text"
                id="editAward"
                className="form-control"
                value={selectedAward?.award || ""}
                onChange={(e) =>
                  setSelectedAward({ ...selectedAward, award: e.target.value })
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

export default Awards;
