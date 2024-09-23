import React from 'react';

const MovieGrid = ({ movies }) => {

    // Fungsi untuk menambahkan movie ke watchlist
    const handleAddWatchlist = (movie) => {
        const token = localStorage.getItem('userToken');

        if (!token) {
            // Jika belum login, redirect ke halaman login
            window.location.href = '/login'; 
            return;
        }

        // Jika sudah login, kirim request ke API untuk menambahkan movie ke watchlist
        fetch('/api/watchlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ movieId: movie.id })
        })
        .then(response => {
            if (response.ok) {
                // Tampilkan notifikasi (di sini menggunakan alert, tapi di aplikasi nyata bisa gunakan React-Toastify atau modal popup)
                alert(`${movie.title} has been added to your watchlist.`);
            } else {
                // Tampilkan error jika gagal
                alert('Failed to add movie to watchlist. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error adding movie to watchlist:', error);
            alert('An error occurred. Please try again later.');
        });
    };

    return (
        <main className="container-fluid px-4 mb-3"> 
            <div className="row justify-content-center movie-grid g-4"> 
                {movies.map((movie) => (
                    <div className="col-md-6" key={movie.id}> 
                        <div className="movie-card d-flex flex-row p-3" style={{ height: '280px' }}> 
                            <img 
                                src={movie.poster} 
                                alt={movie.title} 
                                className="movie-image rounded-image"
                                style={{ height: '100%', objectFit: 'cover' }}  
                            />
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h3 className="card-title">{movie.title}</h3>
                                    <p className="card-text">{movie.description}</p>
                                    <p className="card-text">Genre: {movie.genre && movie.genre.length > 0 ? movie.genre.join(', ') : 'Unknown'}</p>
                                    <p className="card-text">Year: {movie.year}</p>
                                    <p className="card-text">Rating: {movie.rating}</p>
                                </div>
                                <div className="mt-2 d-flex justify-content-between">
                                    <button className="btn btn-golden" onClick={() => handleAddWatchlist(movie)}>
                                        Add Watchlist
                                    </button>
                                    <button 
                                        className="btn btn-clear" 
                                        onClick={() => window.open(movie.trailer, '_blank')}
                                    >
                                        Trailer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default MovieGrid;
