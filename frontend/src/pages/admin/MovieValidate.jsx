import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
// import ActorCard from '../../components/ActorCard';
import Sidebar from '../../components/Sidebar';
import '../../styles/detail.css';


const Movie = () => {
  console.log("Rendering Actor Component");
  // Data dummy
  const dataDummy = [
    {
      movie: "Movie A",
      actors: ["Actor 1", "Actor 2"],
      genres: ["Action", "Romance"],
      sinopsis: "Ini adalah sinopsis singkat dari Drama A.",
      status: "Approved",
    },
    {
      movie: "Movie B",
      actors: ["Actor 3", "Actor 4"],
      genres: ["Drama", "Thriller"],
      sinopsis: "Ini adalah sinopsis singkat dari Drama B.",
      status: "unapproved",
    },
    {
      movie: "Movie C",
      actors: ["Actor 5", "Actor 6"],
      genres: ["Comedy", "Adventure"],
      sinopsis: "Ini adalah sinopsis singkat dari Drama C.",
      status: "unapproved",
    },
  ];

  const actors = [
    { name: "Actor 1", imageUrl: "/images/contoh.png" },
    { name: "Actor 2", imageUrl: "/images/contoh.png" },
    { name: "Actor 3", imageUrl: "/images/contoh.png" },
    { name: "Actor 4", imageUrl: "/images/contoh.png" },
    { name: "Actor 5", imageUrl: "/images/contoh.png" },
    { name: "Actor 6", imageUrl: "/images/contoh.png" },
  ];

  // State for filter, show and search
  const [filter, setFilter] = useState("approved");
  const [shows, setShows] = useState("10");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle shows change
  const handleShowsChange = (e) => {
    setShows(e.target.value);
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle click Edit
  const handleEditClick = (movie) => {
    setCurrentMovie(movie);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMovie(null);
  };

  // Filter and search data
  const filteredData = dataDummy
    .filter((item) => {
      return item.movie.toLowerCase().includes(search.toLowerCase());
    })
    .slice(0, parseInt(shows)); // Limit number of items based on `shows`

  return (
    <div className="container-box">
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box">
        {/* Subheading Actors*/}
        <div className="mt-4 mb-4">
          <h3 className style={{ color: '#C6A628', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>Validate Movie Data</h3>
        </div>

        {/* Filter section */}
        <div className="row mb-3">
          <div className="col-12 col-lg-4 col-md-4 d-flex align-items-center mt-2">
            <label htmlFor="filter" className="me-2">
              Filtered By
            </label>
            <select
              name="filter"
              id="filter"
              className="form-control"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="approved">Approved</option>
              <option value="unapproved">Unapproved</option>
            </select>
          </div>

          <div className="col-12 col-lg-4 col-md-4 d-flex align-items-center mt-2">
            <label htmlFor="shows" className="me-2">
              Shows
            </label>
            <select
              name="shows"
              id="shows"
              className="form-control"
              value={shows}
              onChange={handleShowsChange}
            >
              <option value={dataDummy.length} selected>
                All
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div className="col-12 col-lg-4 col-md-4 d-flex align-items-center mt-2">
            <label htmlFor="search" className="me-2">
              Seacrh
            </label>
            <input
              type="text"
              id="search"
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Table section */}
        <div className="row mt-4">
          <div className="col-12 table-responsive">
            <table className="table-box">
              <thead>
                <tr>
                  <th>Drama</th>
                  <th>Actors</th>
                  <th>Genres</th>
                  <th>Sinopsis</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Render filtered data */}
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.movie}</td>
                    <td>{item.actors.join(", ")}</td>
                    <td>{item.genres.join(", ")}</td>
                    <td>{item.sinopsis}</td>
                    <td>{item.status}</td>
                    <td>
                      <a
                        href="#"
                        className="mx-2"
                        onClick={() => handleEditClick(item)}
                        style={{ color: "#0000FF" }} /* Teks edit dengan warna abu-abu tua */
                      >
                        Edit
                      </a>
                      <span>|</span>
                      <a href="#" className="mx-2" style={{ color: "#FF0000" }}>
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal for Edit */}
      {currentMovie && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton className="justify-content-center">
            <Modal.Title className="w-100 text-center">
              <div className="d-flex justify-content-center">
                <button
                  className="btn text-white mx-2"
                  style={{ backgroundColor: "#C6A628" }}
                >
                  Approve
                </button>
                <button className="btn btn-danger mx-2">Delete</button>
              </div>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row">
              {/* Image Section */}
              <div className="col-md-4">
                <div
                  className="drama-image mb-3"
                  style={{
                    backgroundImage: "url('/images/film.jpg')",
                    height: "100%",
                    width: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "8px",
                  }}
                ></div>
              </div>

              {/* Drama Details Section */}
              <div className="col-md-8">
                <h2 className="drama-title">Title of the Drama</h2>
                <p>
                  <strong>Other Titles:</strong> Title 2, Title 3
                </p>
                <p>
                  <strong>Year:</strong> Spring 2025
                </p>
                <p>
                  <strong>Synopsis:</strong> Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Pellentesque varius velit eu
                  velit facilisis, id fermentum mauris convallis.
                </p>
                <p>
                  <strong>Writer:</strong> Writer Name
                </p>
                <p>
                  <strong>Genre:</strong> Thriller
                </p>
                <p>
                  <strong>Director:</strong> Director Name
                </p>
                <p>
                  <strong>Rating:</strong> 9.5/10
                </p>
                <p>
                  <strong>Availability:</strong> Netflix
                </p>
              </div>
            </div>
            <div className="row mt-2">
              {actors.map((actor, index) => (
                <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                  <div className="card text-center h-100">
                    <img
                      src={actor.imageUrl}
                      alt={`${actor.name}'s portrait`}
                      className="card-img-top"
                      style={{ height: "120px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <p className="card-text fw-bold">{actor.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                height: "50vh",
              }}
            >
              <iframe
                className="w-100 h-100 mt-2 rounded"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                allowFullScreen
                title="YouTube Video"
              ></iframe>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Movie;
