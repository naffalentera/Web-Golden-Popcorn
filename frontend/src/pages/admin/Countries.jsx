import React, { useState } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal"; // Import React Bootstrap Modal

const Country = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([
    { name: "Japan", isDefault: true },
    { name: "Korea", isDefault: false },
    { name: "China", isDefault: false },
    // Add more countries as needed
  ]);

  const [newCountry, setNewCountry] = useState("");

  // Show modal and set selected country
  const handleEditClick = (country) => {
    setSelectedCountry(country);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCountry(null);
  };

  // Save changes made to the country
  const handleSaveChanges = () => {
    const updatedCountries = countries.map((country) =>
      country === selectedCountry ? { ...country, name: selectedCountry.name } : country
    );
    setCountries(updatedCountries);
    handleCloseModal();
  };

  // Handle adding a new country
  const handleAddCountry = () => {
    if (newCountry.trim() !== "") {
      setCountries([...countries, { name: newCountry, isDefault: false }]);
      setNewCountry("");
    }
  };

  // Filter countries based on search term
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>CMS Country</h3>
        </div>

        <div className="d-flex justify-content-start mt-4">
          <input
            type="text"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px"
            }}
            placeholder="Enter new country"
          />
          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#C6A628", borderColor: "#C6A628" }}
            onClick={handleAddCountry}
          >
            Submit
          </button>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>No</th> {/* Menambahkan kolom nomor */}
                <th>Countries</th>
                <th>Default</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries.map((country, index) => (
                <tr key={index}>
                  <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                  <td>{country.name}</td>
                  <td>
                    <input
                      type="radio"
                      name="defaultCountry"
                      checked={country.isDefault}
                      onChange={() => {
                        setCountries(countries.map(c =>
                          c === country
                            ? { ...c, isDefault: true }
                            : { ...c, isDefault: false }
                        ));
                      }}
                    />
                  </td>
                  <td>
                    <a
                      href="#"
                      className="text-primary me-2"
                      onClick={() => handleEditClick(country)}
                    >
                      Edit
                    </a>
                    <span>| </span>
                    <a
                      href="#"
                      className="text-danger"
                      onClick={() => setCountries(countries.filter(c => c !== country))}
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
          <Modal.Title>Edit Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="editCountry" className="form-label">
                Country Name
              </label>
              <input
                type="text"
                id="editCountry"
                className="form-control"
                value={selectedCountry?.name || ""}
                onChange={(e) =>
                  setSelectedCountry({ ...selectedCountry, name: e.target.value })
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

export default Country;
