import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieGridHome = ({ movies }) => {
    useEffect(() => {
        console.log('Movies state updated:', movies);  // Log setiap kali movies diupdate
    }, [movies]);
    const navigate = useNavigate();
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
    const goToDetailPage = (title) => {
        const encodedTitle = encodeURIComponent(title); // Encode title
        navigate(`/movie/title/${encodedTitle}`); // Navigasi ke halaman detail film dengan id
    };
    return (
        <main className="container-fluid px-4 mb-3"> 
    <div className="row justify-content-center g-4"> 
        {movies.map((movie) => (
            <div className="col-md-2" key={movie.id_movie}> 
                <div className="movies-card p-3 text-center"> 
                    <img 
                        src={movie.poster || '/images/default-movie.png'} 
                        alt={movie.title} 
                        className="movies-image img-fluid rounded"
                        style={{ cursor: 'pointer' }}  
                        onClick={() => goToDetailPage(movie.title)}
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = '/images/default-movie.png'; 
                        }}
                    />
                    <div className="btn-wrapper">
                        <button className="btn-add-watchlist" onClick={() => handleAddWatchlist(movie)}>
                            Add Watchlist
                        </button>
                        <button className="btn-trailer" onClick={() => window.open(movie.trailer, '_blank')}>
                            Trailer
                        </button>
                    </div>
                    <h5 className="movies-title mt-2">
                        {movie.title}
                    </h5>
                </div>
            </div>
        ))}
    </div>
</main>
    );
};
export default MovieGridHome;