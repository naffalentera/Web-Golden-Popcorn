import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Filter = ({ onFilterChange, resetFilters, onResetComplete }) => {
    const [years, setYears] = useState([]);
    const [genres, setGenres] = useState([]);
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedCountry, setSelectedCountry] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const startYear = 1990;
        const yearArray = [];
        for (let year = startYear; year <= currentYear; year++) {
            yearArray.push(year);
        }
        setYears(["All", ...yearArray]);  
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/genres');
                const data = await response.json();
                setGenres(["All", ...data.map(item => item.name)]);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        const fetchCountries = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/countries');
                const data = await response.json();
                setCountries(["All", ...data.map(item => item.name)]);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        // Call all the fetch functions
        fetchGenres();
        fetchCountries();
    }, []);

    // Reset filters when `resetFilters` changes
    useEffect(() => {
        if (resetFilters) {
            setSelectedGenre('all');
            setSelectedCountry('all');
            setSelectedYear('all');
            onFilterChange({ year: 'all', genre: 'all', country: 'all'});
            onResetComplete();  // Notify parent that reset is complete
        }
    }, [resetFilters, onFilterChange, onResetComplete]);

    // Fungsi untuk reset filter secara manual
    const clearFilters = () => {
        setSelectedGenre('all');
        setSelectedCountry('all');
        setSelectedYear('all');
        onFilterChange({
            year: 'all',
            genre: 'all',
            country: 'all'
        });
    };

    // Fungsi untuk submit filter
    const submitFilters = (e) => {
        e.preventDefault();

         // Validasi filter sebelum memanggil API
        if (!selectedYear || !selectedGenre || !selectedCountry) {
            console.error('All filters must be selected');
            return;
        }

        const filters = {
            year: selectedYear,
            genre: selectedGenre,
            country: selectedCountry,
        };
        
        onFilterChange(filters);
    };   

    const handleAddMovieClick = () => {
        const token = sessionStorage.getItem('UserToken');

        if (!token) {
            navigate('/login');
        } else {
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
                
                {/* Submit and Clear Buttons */}
                <button id="submit" type="submit" className="btn btn-golden w-100 mb-2" onClick={submitFilters}>Submit</button>
                <button id="clear" className="btn-red w-100" onClick={clearFilters}>Clear</button>
            </div>
        </aside>
    );
};

export default Filter;
