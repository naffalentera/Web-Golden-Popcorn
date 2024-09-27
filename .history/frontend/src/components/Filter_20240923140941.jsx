import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Filter = ({ onFilterChange }) => {
    const [years, setYears] = useState([]);
    const [genres, setGenres] = useState([]);
    const [countries, setCountries] = useState([]);
    const [awards, setAwards] = useState([]);
    const navigate = useNavigate();

    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [selectedAward, setSelectedAward] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');

    useEffect(() => {
        // Generate years dynamically from 1990 to 2024
        const currentYear = new Date().getFullYear();
        const startYear = 1990;
        const yearArray = [];
        for (let year = startYear; year <= currentYear; year++) {
            yearArray.push(year);
        }
        setYears(["All", ...yearArray]);  // Add "All" option at the beginning
    }, []);

    useEffect(() => {
        // Fetch genres from API
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/genres');
                const data = await response.json();
                setGenres(["All", ...data.map(item => item.name)]);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        // Fetch countries from API
        const fetchCountries = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/countries');
                const data = await response.json();
                setCountries(["All", ...data.map(item => item.name)]);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        // Fetch awards from API
        const fetchAwards = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/awards');
                const data = await response.json();
                setAwards(["All", ...data.map(item => item.name)]);
            } catch (error) {
                console.error('Error fetching awards:', error);
            }
        };

        // Call all the fetch functions
        fetchGenres();
        fetchCountries();
        fetchAwards();
    }, []);

    // Fungsi untuk reset filter
    const clearFilters = () => {
        setSelectedGenre('all');
        setSelectedCountry('all');
        setSelectedAward('all');
        setSelectedYear('all');
        onFilterChange({
        year: 'all',
        genre: 'all',
        country: 'all',
        award: 'all',
        });
    };

    // Fungsi untuk submit filter
    const submitFilters = (e) => {
        e.preventDefault();  // Prevent form submission
        onFilterChange({
        year: selectedYear,
        genre: selectedGenre,
        country: selectedCountry,
        award: selectedAward,
        });
    };

    const handleAddMovieClick = () => {
        const token = localStorage.getItem('userToken');

        if (!token) {
            // Jika belum login, arahkan ke halaman login
            navigate('/login');
        } else {
            // Jika sudah login, arahkan ke halaman Add Movie
            navigate('/add-movie');
        }
    };

    return (
        <aside className="col-md-3" id="filterAside">
            <button className="btn btn-golden w-100 mb-3" onClick={handleAddMovieClick}>+ Add Movie</button>
            <div className="filters">
                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Year</label>
                    <select id="year" className="form-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                        {years.map((year, index) => (
                        <option key={index} value={year === 'All' ? 'all' : year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="genre" className="form-label">Genre</label>
                    <select id="genre" className="form-select" value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                        {genres.map((genre, index) => (
                        <option key={index} value={genre.toLowerCase()}>{genre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select id="country" className="form-select" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
                        {countries.map((country, index) => (
                        <option key={index} value={country.toLowerCase()}>{country}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="award" className="form-label">Award</label>
                    <select id="award" className="form-select" value={selectedAward} onChange={e => setSelectedAward(e.target.value)}>
                        {awards.map((award, index) => (
                        <option key={index} value={award.toLowerCase()}>{award}</option>
                        ))}
                    </select>
                </div>
                {/* Submit and Clear Buttons */}
                <button id="submit" type="submit" className="btn btn-golden w-100 mb-2" onClick={submitFilters}>Submit</button>
                <button id="clear" className="btn btn-clear w-100" onClick={clearFilters}>Clear</button>
            </div>
        </aside>
    );
};

export default Filter;
