import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filter from '../../components/Filter';
import MovieGrid from '../../components/MovieGrid';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';


const HomePage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [sortedMovies, setSortedMovies] = useState([]);
  const [sortBy, setSortBy] = useState('alphabetics-az');
  const [resetFilters, setResetFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Dapatkan token dari query parameter di URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');


    if (token) {
      // Simpan token di sessionStorage
      sessionStorage.setItem('UserToken', token);

      // Setelah menyimpan token, hilangkan query parameter dari URL
      window.location.href = 'http://localhost:3000/home'; // Redirect tanpa query parameters
    }
  }, [navigate]);

  // Fetch semua data film tanpa query pencarian
  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     try {
  //       const res = await fetch('http://localhost:5000/api/movies/all');
  //       const data = await res.json();
  //       setMovies(data);
  //     } catch (err) {
  //       console.error(err.message);
  //     }
  //   };

  //   fetchMovies(currentPage);
  // }, [currentPage]);

  const fetchMovies = async (page) => {
    try {
      // Mengambil data film dari API, dengan query parameter page dan limit
      const res = await fetch(`http://localhost:5000/api/movies/all?page=${page}`);
      const data = await res.json(); // Mengubah respons API menjadi JSON
      console.log('Fetched movies:', data);
      // setMovies(data); // Update state movies dengan data baru
      if (Array.isArray(data.movies)) {
        setMovies(data.movies); // Menyimpan data movies sebagai array
        setTotalPages(data.totalPages);
      } else {
        console.error("Data movies tidak dalam format array:", data);
      }
    } catch (err) {
      console.error('Error fetching movies:', err); // Menangani error
    }
  };

  // Ketika currentPage berubah, panggil useEffect untuk mengambil data film
  useEffect(() => {
    fetchMovies(currentPage); // Ambil film sesuai halaman saat ini
  }, [currentPage]);

  // Apply sorting ke seluruh film
  useEffect(() => {

    // Hapus duplikasi berdasarkan id_movie
    const uniqueMovies = movies.filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.id_movie === movie.id_movie)
    );

    let sorted = [...uniqueMovies];

    if (sortBy === 'alphabetics-az') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'alphabetics-za') {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year-asc') {
      sorted.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'year-desc') {
      sorted.sort((a, b) => b.year - a.year);
    }

    setSortedMovies(sorted);
  }, [movies, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (filters) => {  
    const { genre, country, award, year } = filters;

    fetch(`http://localhost:5000/api/movies/?genre=${genre}&country=${country}&award=${award}&year=${year}&page=1`)
      .then(response => response.json())
      .then(data => {
        // setMovies(data);  // Update state movies dengan hasil yang difilter
        if (Array.isArray(data.movies)) {
          setMovies(data.movies);  // Menyimpan data hasil filter
          setTotalPages(data.totalPages);  // Update total pages sesuai filter
          setCurrentPage(1);
        } else {
          console.error("Data filter tidak dalam format array:", data);
        }
      })
      .catch(error => {
        console.error('Error fetching filtered movies:', error);
      });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      fetchMovies(currentPage + 1); // Fetch data page berikutnya
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1); // Kurangi currentPage untuk kembali ke halaman sebelumnya
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 d-flex">
        <Filter 
          onFilterChange={handleFilterChange} 
          resetFilters={resetFilters} 
          onResetComplete={() => setResetFilters(false)} 
        />
        <div className="col-md-10 mt-3">
          <div className="d-flex justify-content-end gap-2 align-items-center mb-3">
            <label htmlFor="sort" className="form-label mb-0">Sorted by:</label>
            <select id="sort" className="form-select w-auto" value={sortBy} onChange={handleSortChange}>
              <option value="alphabetics-az">Alphabetics A-Z</option>
              <option value="alphabetics-za">Alphabetics Z-A</option>
              <option value="rating">Rating</option>
              <option value="year-asc">Year (Oldest to Newest)</option>
              <option value="year-desc">Year (Newest to Oldest)</option>
            </select>
          </div>
          <MovieGrid movies={sortedMovies} />
          {/* Tombol Pagination */}
          <div className="d-flex justify-content-center gap-2 align-items-center mb-3" >
            <Button className="btn-golden" onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button className="btn-golden" onClick={handleNextPage}>
              Next
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
