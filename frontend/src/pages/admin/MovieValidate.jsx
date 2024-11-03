import React, { useState, useEffect } from "react"; 
import { Button } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import EditMovieModal from '../../components/EditMovieModal';
import '../../styles/detail.css';
import Swal from 'sweetalert';

const MovieValidate = () => {

  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState([]); 
  const [filter, setFilter] = useState("all");
  const [shows, setShows] = useState("15");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies/validate');
        if (!response.ok) {
          throw new Error(`Error fetching movies, status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data); // Update state with fetched data
        
        const actorResponse = await fetch(`http://localhost:5000/api/movies/validate/${data.id_movie}/actors`);
        const actorData = await actorResponse.json();
        console.log('Actors:', actorData);
        setActors(actorData);  // Simpan data aktor ke state'

      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  // Fetch actors for selected movie
  const fetchActors = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}/actors`);
      if (!response.ok) {
        throw new Error('Failed to fetch actors');
      }
      const actorData = await response.json();
      return actorData;
    } catch (error) {
      console.error('Error fetching actors:', error);
      return [];
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); 
  };

  // Handle shows change
  const handleShowsChange = (e) => {
    const selectedValue = Number(e.target.value);
    setShows(selectedValue); // Convert to number
    setCurrentPage(1); // Reset to page 1 on shows change
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); 
  };

  // Handle click Edit
  const handleEditClick = async (movie) => {
    const actors = await fetchActors(movie.id_movie); // Fetch actors for selected movie
    setCurrentMovie({ ...movie, actors }); // Set current movie with actors
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMovie(null);
  };

    // Handle approve movie
  const handleApprove = async (movie) => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movie.id_movie}/approve`, {
        method: 'PUT',
      });
  
      if (response.ok) {
        // Perbarui status film di state movies
        setMovies((prevMovies) =>
          prevMovies.map((m) =>
            m.id_movie === movie.id_movie ? { ...m, status: 'approved' } : m
          )
        );
        Swal("Movie approved successfully!", {
          icon: "success",
        });
      } else {
        Swal("Failed to approve movie", {
          icon: "error",
        });
      }
    } catch (error) {
      console.error('Error approving movie:', error);
      Swal("Error approving movie", {
        icon: "error",
      });
    }
  
    setShowModal(false);
  };
  
  // handle hapus movie
  const handleDelete = (movie) => {
    Swal({
      title: `Are you sure you want to delete "${movie.title}"?`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`http://localhost:5000/api/movies/${movie.id_movie}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            setMovies((prevMovies) => prevMovies.filter((m) => m.id_movie !== movie.id_movie));
            Swal("Movie deleted successfully!", {
              icon: "success",
            });
          } else {
            Swal("Failed to delete movie", {
              icon: "error",
            });
          }
        } catch (error) {
          console.error('Error deleting movie:', error);
        }
      }
    });
  };



  // Handle previous and next page
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

// Filter and search data
const filteredData = movies
  .filter((movie) => {
    // Pastikan movie.status tidak null atau undefined
    if (filter === "approved") {
      return movie.status?.toLowerCase() === "approved";
    } else if (filter === "unapproved") {
      return movie.status?.toLowerCase() === "unapproved";
    }
    return true; // Default, tidak ada filter
  })
  .filter((movie) => {
    // Pastikan movie.movie ada sebelum menggunakan toLowerCase
    return movie.title?.toLowerCase().includes(search.toLowerCase());
  })

  // Calculate total pages based on filtered data and `shows` value
  const totalPages = shows === -1 ? 1 : Math.ceil(filteredData.length / shows);

  // Get data for the current page
  const paginatedData = shows === -1 ? filteredData : filteredData.slice(
    (currentPage - 1) * shows,
    currentPage * shows
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
          <h3 style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>
            Validate Movie Data
          </h3>
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
              <option value="All">All</option>
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
              <option value="15">15</option>
              <option value="30">30</option>
            </select>
          </div>

          <div className="col-12 col-lg-4 col-md-4 d-flex align-items-center mt-2">
            <label htmlFor="search" className="me-2">
              Search
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
                  <th>Title</th>
                  <th>Actors</th>
                  <th>Genres</th>
                  <th>Sinopsis</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Render paginated data */}
                {paginatedData.map((movie, index) => (
                  <tr key={index}>
                    <td>{movie.title}</td>
                    <td>{movie.actors.join(", ")}</td>
                    <td>{movie.genres.join(", ")}</td>
                    <td>{movie.synopsis}</td>
                    <td>{movie.status}</td>
                    <td>
                      <button
                        className="mx-2"
                        onClick={() => handleEditClick(movie)}
                        style={{ color: "#0000FF", background: "none", border: "none", padding: "0", textDecoration: "underline", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <span>|</span>
                      <button
                        className="mx-2"
                        onClick={() => handleDelete(movie)}
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

        {/* Pagination Controls - Show only if shows is not "All" */}
        {shows !== -1 && (
          <div className="d-flex justify-content-center gap-2 align-items-center mb-3">
            <Button className="btn-golden" onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button className="btn-golden" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Modal for Edit */}
      <EditMovieModal
        show={showModal}
        handleClose={handleCloseModal}
        movie={currentMovie}
        handleApprove={handleApprove}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default MovieValidate;