import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal"; // Import React Bootstrap Modal
import Swal from 'sweetalert';


const Genres = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]); // Untuk menampilkan hasil pencarian
  const [isSearching, setIsSearching] = useState(false);
  


  // Fetch genres data from API when component mounts
  useEffect(() => {
    fetchGenres();
  }, []);

  // Function to fetch genres data
  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/genres');
      const data = await response.json();
      setGenres(data);
      setFilteredGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Fungsi untuk menangani perubahan di input pencarian
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setIsSearching(false);
      setFilteredGenres(genres); // Tampilkan semua data jika pencarian kosong
    } else {
      setIsSearching(true);
      const filtered = genres.filter((genre) =>
        genre.name.toLowerCase().includes(searchValue)
      );
      setFilteredGenres(filtered); // Tampilkan data yang sesuai dengan pencarian
    }
  };

  // Add new genre function with success notification
  const handleAddGenre = async () => {
    if (newGenre.trim() !== "") {
      try {
        const response = await fetch('http://localhost:5000/api/genres', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newGenre })
        });

        if (!response.ok) {
          throw new Error("Failed to add genre");
        }

        const data = await response.json();
        setGenres([...genres, data]);
        setFilteredGenres([...filteredGenres, data]);
        setNewGenre("");
        Swal.fire("Success", "Genre successfully added!", "success"); // Success notification for add
      } catch (error) {
        console.error("Error adding genre:", error);
        Swal.fire("Error", "Failed to add genre.", "error"); // Error notification for add
      }
    }
  };

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

  // Function to save changes in genre with success notification
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/genres/${selectedGenre.id_genre}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedGenre.name })
      });
  
      if (!response.ok) {
        throw new Error("Failed to update genre");
      }
  
      const updatedGenre = await response.json();
  
      // Update genres dan filteredGenres
      setGenres((prev) =>
        prev.map((genre) =>
          genre.id_genre === updatedGenre.id_genre ? updatedGenre : genre
        )
      );
      setFilteredGenres((prev) =>
        prev.map((genre) =>
          genre.id_genre === updatedGenre.id_genre ? updatedGenre : genre
        )
      );
  
      handleCloseModal();
      Swal.fire("Success", "Genre successfully updated!", "success");
    } catch (error) {
      console.error("Error updating genre:", error);
      Swal.fire("Error", "Failed to update genre.", "error");
    }
  };  

  // Function to delete genre with success notification
  const handleDeleteGenre = (genre) => {
    Swal({
      title: `Are you sure you want to delete "${genre.name}"?`,
      icon: 'warning',
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`http://localhost:5000/api/genres/${genre.id_genre}`, {
            method: 'DELETE'
          });
  
          if (!response.ok) {
            const errorData = await response.json(); 
            const errorMessage = errorData.message || "Unknown error occurred"; 
            throw new Error(`Failed to delete genre. ${errorMessage}`);
          }
  
          const updatedGenres = genres.filter(g => g.id_genre !== genre.id_genre);
          setGenres(updatedGenres);
          setFilteredGenres(updatedGenres);
          
          Swal("Genre successfully deleted!", { icon: "success" });
        } catch (error) {
          console.error("Error deleting genre:", error.message);
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
      {/* Sidebar Section */}
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box" style={{ width: "100%" }}>    
        {/* Title Section */}
        <div className="mt-4 mb-4">
          <h3 className="text-white" style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '27px' }}>CMS Genres</h3>
        </div>

        <div className="d-flex justify-content-start mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
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
          
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            style={{ borderRadius: "10px", backgroundColor: "#FFFFFF", border: "#C6A628", padding: "10px 20px", color: "#000000", marginRight: "10px", width: "250px" }}
            placeholder="Add new genre"
          />
          <button className="btn btn-primary" style={{ backgroundColor: "#C6A628", borderColor: "#C6A628" }} onClick={handleAddGenre}>Submit</button>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>Genres</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGenres.map((genre) => (
                <tr key={genre.id_genre}>
                  <td>{genre.name}</td>
                  <td>
                    <a href="#" className="text-primary me-2" onClick={() => handleEditClick(genre)}>Edit</a>
                    <span>| </span>
                    <a href="#" className="text-danger" onClick={() => handleDeleteGenre(genre)}>Delete</a>
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
              <label htmlFor="editGenre" className="form-label">Genre Name</label>
              <input
                type="text"
                id="editGenre"
                className="form-control"
                value={selectedGenre?.name || ""}
                onChange={(e) => setSelectedGenre({ ...selectedGenre, name: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
          <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
        </Modal.Footer>
      </Modal>

      {/* Toast Container for Notifications */}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Genres;