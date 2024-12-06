import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal";
import Swal from 'sweetalert';

const Actor = () => {
  const [actors, setActors] = useState([]); 
  const [avatar, setAvatar] = useState(null);
  const [photoURL, setPhotoURL] = useState(''); // State for URL input
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null); 
  const [editedPhoto, setEditedPhoto] = useState(null);
  const [editedPhotoURL, setEditedPhotoURL] = useState(''); // State for editing URL
  const [newActor, setNewActor] = useState({ name: "", photo: null }); 

  // State buat pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; 

  // Fetch actors data from backend
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/actors');
        if (!response.ok) throw new Error('Failed to fetch actors');
        const data = await response.json();
        setActors(data); // Update state dengan data aktor dari backend
        console.log("Fetched actors:", data); // Debugging
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    fetchActors();
  }, []);

  if (!actors) {
    return <div>Loading...</div>;  // Menampilkan loading sementara
  }

  // Filter actors berdasarkan search term
  const filteredActors = actors.filter((actors) =>
    actors.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastActor = currentPage * itemsPerPage;
  const indexOfFirstActor = indexOfLastActor - itemsPerPage;
  const currentActors = filteredActors.slice(indexOfFirstActor, indexOfLastActor);

  const totalPages = Math.ceil(filteredActors.length / itemsPerPage);

  // Handler for changing the page
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 whenever search term changes
  };

  // Handler untuk file input baru
  const handleNewActorFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setNewActor({ ...newActor, photo: file });
      setPhotoURL(''); // Clear URL input when file is selected
    }
  };

  // Handle URL input for new actor
  const handleNewActorURLChange = (e) => {
    setPhotoURL(e.target.value);
    setAvatar(e.target.value); // Update avatar preview with URL
    setNewActor({ ...newActor, photo: e.target.value });
  };

  // Handler untuk perubahan file di modal edit
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedPhoto(URL.createObjectURL(file));
      setSelectedActor({ ...selectedActor, photo: file });
      setEditedPhotoURL(''); // Clear URL input when file is selected
    }
  };

  // Handle URL input for editing actor photo
  const handleEditURLChange = (e) => {
    setEditedPhotoURL(e.target.value);
    setEditedPhoto(e.target.value); // Update edited photo preview with URL
    setSelectedActor({ ...selectedActor, photo: e.target.value });
  };

  // Fungsi untuk menambah aktor baru
  const handleAddNewActor = async () => {
    if (newActor.name && newActor.photo) {
      try {
        const response = await fetch('http://localhost:5000/api/actors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newActor.name,
            photo: typeof newActor.photo === 'string' ? newActor.photo : avatar
          })
        });

        if (response.ok) {
          const data = await response.json();
          setActors((prevActors) => [...prevActors, data.actor]); // Add the new actor to the list
          Swal("Actor added successfully!", { icon: "success" });
          
          // Reset the input fields
          setNewActor({ name: "", photo: null });
          setAvatar(null);
          setPhotoURL('');
        } else {
          Swal("Failed to add actor", { icon: "error" });
        }
      } catch (error) {
        console.error("Error adding actor:", error);
        Swal("An error occurred while adding the actor.", { icon: "error" });
      }
    } else {
      Swal("Please provide both a name and a photo for the actor.", { icon: "warning" });
    }
  };


  // Fungsi untuk menghapus aktor
  const handleDeleteActor = (actor) => {
    Swal({
      title: `Are you sure you want to delete "${actor.name}"?`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`http://localhost:5000/api/actors/${actor.id_actor}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setActors((prevActors) => prevActors.filter((a) => a.id_actor !== actor.id_actor));
            Swal("Actor deleted successfully!", { icon: "success" });
          } else {
            const errorData = await response.json();
            Swal(errorData.message || "Failed to delete actor", { icon: "error" });
          }
        } catch (error) {
          console.error("Error deleting actor:", error);
          Swal("Failed to delete actor. Try again.", { icon: "error" });
        }
      }
    });
  };

  // Show modal dan set selected actor
  const handleEditClick = (actors) => {
    setSelectedActor(actors);
    setEditedPhoto(actors.photo);
    setEditedPhotoURL('');
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActor(null);
    setEditedPhoto(null);
    setEditedPhotoURL('');
  };

  // Fungsi untuk save update data
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/actors/${selectedActor.id_actor}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selectedActor.name,
          photo: typeof selectedActor.photo === 'string' ? selectedActor.photo : editedPhoto
        })
      });

      if (response.ok) {
        const data = await response.json();
        setActors((prevActors) =>
          prevActors.map((actor) =>
            actor.id_actor === data.actor.id_actor ? data.actor : actor
          )
        );
        Swal("Actor updated successfully!", { icon: "success" });
        handleCloseModal();
      } else {
        Swal("Failed to update actor", { icon: "error" });
      }
    } catch (error) {
      console.error("Error updating actor:", error);
      Swal("An error occurred while updating the actor.", { icon: "error" });
    }
  };

  return (
    <div className="container-box">
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box">    
        <div className="mt-4 mb-4">
          <h3 style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>CMS Actor</h3>
        </div>

        <div className="card-box">
          <div className="card-body">
            <div className="row center">
              <div className="col-md-6">
                <form>
                  <div className="mb-3">
                    <label htmlFor="actorName" className="form-label">Actor Name</label>
                    <input
                      type="text"
                      id="actorName"
                      className="form-control"
                      placeholder="Enter actor name"
                      value={newActor.name}
                      onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
                    />
                  </div>
                </form>
              </div>

              <div className="col-md-4">
                <div className="d-flex flex-column">
                  <label htmlFor="avatarUpload" className="form-label">Upload Avatar</label>
                  <input
                    type="file"
                    id="avatarUpload"
                    className="form-control"
                    accept="image/*"
                    onChange={handleNewActorFileChange}
                  />
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Or enter image URL"
                    value={photoURL}
                    onChange={handleNewActorURLChange}
                  />
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

              <div className="col-md-2 d-flex align-items-end mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddNewActor}
                >
                  Add New Actor
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
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
                <th>Actor Name</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentActors.map((actor, index) => (
                <tr key={index}>
                  <td>{actor.name}</td>
                  <td>
                    <img
                      src={actor.photo}
                      alt="Actor"
                      className="img-fluid rounded"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>
                    <button
                      className="text-primary me-2"
                      onClick={() => handleEditClick(actor)}
                      style={{ color: "#0000FF", background: "none", border: "none", padding: "0", textDecoration: "underline", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <span>| </span>
                    <button
                      onClick={() => handleDeleteActor(actor)}
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

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-3">
          <button
            onClick={() => handlePageChange("prev")}
            className="btn btn-secondary mx-1"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange("next")}
            className="btn btn-secondary mx-1"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>    
      </div>

      {/* Modal for editing actor */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Actor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="editName" className="form-label">Actor Name</label>
              <input
                type="text"
                id="editName"
                className="form-control"
                value={selectedActor?.name || ""}
                onChange={(e) => setSelectedActor({ ...selectedActor, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
                <label htmlFor="editPhoto" className="form-label">Update Photo</label>
                <input
                  type="file"
                  id="editPhoto"
                  className="form-control"
                  accept="image/*"
                  onChange={handleEditFileChange}
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Or enter image URL"
                  value={editedPhotoURL}
                  onChange={handleEditURLChange}
                />
                {editedPhoto && (
                  <div className="mt-3">
                    <img
                      src={editedPhoto}
                      alt="Edited Avatar Preview"
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
            </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
          <button className="btn btn-primary"  onClick={handleSaveChanges} >Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Actor;
