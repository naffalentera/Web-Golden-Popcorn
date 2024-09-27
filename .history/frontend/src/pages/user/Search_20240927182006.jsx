import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filter from '../../components/Filter';
import MovieGrid from '../../components/MovieGrid';

const SearchPage = () => {
  const [movies, setMovies] = useState([]);
  const [sortedMovies, setSortedMovies] = useState([]); // State for movies after sorting
  const [filteredMovies, setFilteredMovies] = useState({ year: 'all', genre: 'all', country: 'all', award: 'all' }); // State for filtering criteria
  const [sortBy, setSortBy] = useState('alphabetics-az');  // State for sorting criteria
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  
  // Fetch movies based on the search query
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/movies?query=${query}`);
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (query) {
      fetchMovies();
    }
  }, [query]);

  // Apply sorting
  useEffect(() => {
    // Apply sorting
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
    // setFilteredMovies(filters);  // Update the filter criteria based on user input
  
    const { genre, country, award, year } = filters;

    console.log('Fetching filtered movies with:', { query, genre, country, award, year });

    // Fetch data yang difilter dari backend berdasarkan filter
    fetch(`http://localhost:5000/api/movies?query=${query}&genre=${genre}&country=${country}&award=${award}&year=${year}`)
      .then(response => response.json())
      .then(data => {
          console.log('Filtered movies received:', data);
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
          <Filter onFilterChange={handleFilterChange} />
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
            {query ? (
                <>
                    <p className="mb-4 text-center">
                        Showing results for: <span className="text" style={{ color: '#E50914' }}>{query}</span>
                    </p>
                    <MovieGrid movies={sortedMovies} />
                </>
            ) : (
                <p className="text-center">Please enter a keyword to search for movies.</p>
            )}
          </div>
        </main>
        <Footer />
    </div>
  );
};

export default SearchPage;
