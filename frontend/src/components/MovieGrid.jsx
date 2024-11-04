import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieGrid = ({ movies }) => {
    // useEffect(() => {
    //     console.log('Movies state updated:', movies);  // Log setiap kali movies diupdate
    // }, [movies]);

    const navigate = useNavigate();

    // Fungsi untuk menambahkan movie ke watchlist
    const handleAddWatchlist = (movie) => {
        const token = sessionStorage.getItem('UserToken');
        console.log('Token received', token);

        if (!token) {
            // Jika belum login, redirect ke halaman login
            window.location.href = '/login'; 
            return;
        }

        // Jika sudah login, kirim request ke API untuk menambahkan movie ke watchlist
        fetch('http://localhost:5000/api/watchlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ movieId: movie.id_movie  }) 
        })
        .then(response => {
            console.log(response);
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

    const goToDetailPage = (title) => {
        const encodedTitle = encodeURIComponent(title); // Encode title
        navigate(`/movie/title/${encodedTitle}`); // Navigasi ke halaman detail film dengan id
    };

    return (
        <main className="container-fluid px-4 mb-3"> 
            <div className="row justify-content-center g-4"> 
                {movies.map((movie) => (
                    <div className="col-md-6" key={movie.id}> 
                        <div className="movie-card d-flex flex-row p-3"> 
                            <img 
                                src={movie.poster || '/images/default-movie.png'} 
                                alt={movie.title} 
                                className="movie-image rounded-image"
                                style={{ height: '100%', objectFit: 'cover', cursor: 'pointer' }}  
                                onClick={() => goToDetailPage(movie.title)}
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = '/images/default-movie.png'; 
                                }}
                            />
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h3 className="card-title"
                                        style={{ cursor: 'pointer' }} 
                                        onClick={() => goToDetailPage(movie.title)}>{movie.title}</h3>
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
                                        className="btn-red" 
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
