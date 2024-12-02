import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal";
import Swal from 'sweetalert';

const Countries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/countries');
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);


  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setIsSearching(false);
      setFilteredCountries(countries);
    } else {
      setIsSearching(true);
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchValue)
      );
      setFilteredCountries(filtered);
    }
  };

  const handleAddCountry = async () => {
    if (newCountry.trim() !== "") {
      try {
        const response = await fetch('http://localhost:5000/api/countries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCountry })
        });

        if (!response.ok) {
          throw new Error("Failed to add country");
        }

        const data = await response.json();
        setCountries([...countries, data]);  // Update tanpa reload
        setNewCountry("");
        Swal("Country successfully added!", { icon: "success" });
      } catch (error) {
        console.error("Error adding country:", error);
        Swal("Failed to add country.", { icon: "error" });
      }
    } else {
      Swal("Please provide a valid country name.", { icon: "warning" });
    }
  };

  const handleEditClick = (country) => {
    setSelectedCountry(country);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCountry(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedCountry || !selectedCountry.id_country || !selectedCountry.name) {
      Swal("Please provide a valid country name.", { icon: "warning" });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/countries/${selectedCountry.id_country}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedCountry.name })
      });

      if (!response.ok) {
        throw new Error('Failed to update country');
      }

      const updatedCountry = await response.json();
      setCountries((prevCountries) =>
        prevCountries.map((country) =>
          country.id_country === updatedCountry.id_country ? updatedCountry : country
        )
      );
      Swal("Country successfully updated!", { icon: "success" });
      handleCloseModal();
    } catch (error) {
      console.error("Error updating country:", error);
      Swal("Failed to update country.", { icon: "error" });
    }
  };

  const handleDeleteCountry = (country) => {
    console.log("Attempting to delete country with ID:", country.id_country); // Debugging log
    if (!country || !country.id_country) {
      console.error("Invalid country ID for deletion");
      return;
    }
  
    // Swal confirmation and deletion logic
    Swal({
      title: `Are you sure you want to delete "${country.name}"?`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`http://localhost:5000/api/countries/${country.id_country}`, {
            method: 'DELETE'
          });
          if (!response.ok) {
            const errorData = await response.json(); 
            const errorMessage = errorData.message || "Unknown error occurred"; 
            throw new Error(`Failed to delete country. ${errorMessage}`);
          }
          setCountries(countries.filter(c => c.id_country !== country.id_country));
          Swal("Country successfully deleted!", { icon: "success" });
        } catch (error) {
          console.error("Error deleting country:", error.message); // Tampilkan pesan lengkap di console
          Swal({
            title: "Error",
            text: error.message, // Gabungkan pesan default dan error spesifik
            icon: "error",
          });
        }
      }
    });
    
  };  

  return (
    <div className="container-box d-flex">
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box" style={{ width: "100%" }}>
        <div className="mt-4 mb-4">
          <h3 className="text-white" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '27px' }}>CMS Country</h3>
        </div>

        <div className="d-flex justify-content-start mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange= {handleSearchChange}
            style={{ borderRadius: "10px", backgroundColor: "#FFFFFF", border: "#C6A628", padding: "10px 20px", color: "#000000", marginRight: "10px", width: "250px" }}
            placeholder="Search"
          />
          <input
            type="text"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            style={{ borderRadius: "10px", backgroundColor: "#FFFFFF", border: "#C6A628", padding: "10px 20px", color: "#000000", marginRight: "10px", width: "250px" }}
            placeholder="Add new country"
          />
          <button className="btn btn-primary" style={{ backgroundColor: "#C6A628", borderColor: "#C6A628" }} onClick={handleAddCountry}>Submit</button>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>Countries</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries.map((country, index) => (
                <tr key={country.id_country}>
                  <td>{country.name}</td>
                  <td>
                    <button
                      className="text-primary me-2"
                      onClick={() => handleEditClick(country)}
                      style={{ color: "#0000FF", background: "none", border: "none", padding: "0", textDecoration: "underline", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <span>| </span>
                    <button
                      onClick={() => handleDeleteCountry(country)}
                      style={{ color: "#FF0000", background: "none", border: "none", padding: "0", textDecoration: "underline", cursor: "pointer" }}
                    >
                      Delete
                    </button>
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
              <label htmlFor="editCountry" className="form-label">Country Name</label>
              <input
                type="text"
                id="editCountry"
                className="form-control"
                value={selectedCountry?.name || ""}
                onChange={(e) => setSelectedCountry({ ...selectedCountry, name: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
          <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Countries;
