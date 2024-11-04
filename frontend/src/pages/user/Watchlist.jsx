import React, { useState, useEffect } from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filter from '../../components/Filter';
import MovieGrid from '../../components/MovieGrid';

const WatchlistPage = () => {
  const [movies, setMovies] = useState([]);
  const [sortedMovies, setSortedMovies] = useState([]); // State for movies after sorting
  const [sortBy, setSortBy] = useState('alphabetics-az');  // State for sorting criteria
  const [resetFilters, setResetFilters] = useState(false);
  
  // Panggil API watchlist
  useEffect(() => {
    const token = sessionStorage.getItem('UserToken');

    const fetchWatchlist = async () => {
      console.log('Token received', token);
      try {
        const res = await fetch('http://localhost:5000/api/watchlist', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Pastikan token valid dikirimkan
          }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setMovies(data);  // Set data jika berbentuk array
        } else {
          setMovies([]);  // Jika bukan array, set ke array kosong
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchWatchlist();
  }, []);


  // Apply filtering and sorting
   useEffect(() => {
    let sorted = [...movies];

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

    fetch(`http://localhost:5000/api/movies/?genre=${genre}&country=${country}&award=${award}&year=${year}`)
      .then(response => response.json())
      .then(data => {
        setMovies(data);  // Update state movies dengan hasil yang difilter
      })
      .catch(error => {
        console.error('Error fetching filtered movies:', error);
      });
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
          <div className="col-md-10 mt- mx-auto">
          <div className="row justify-content-center mb-4 mt-4">
            <div className="col-12 text-center">
              <span style={{ color: '#FFFFFF', fontFamily: 'Oswald', fontSize: '40px' }}>Your </span>
              <span style={{ color: '#C6A628', fontFamily: 'Oswald', fontSize: '40px' }}>Watchlist</span>
            </div>
          </div>
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
            {movies.length > 0 ? (
              <MovieGrid movies={sortedMovies} />
            ) : (
              <p className="text-center">Your watchlist is empty.</p>
            )}
          </div>
        </main>
        <Footer />
    </div>
  );
};

export default WatchlistPage;
