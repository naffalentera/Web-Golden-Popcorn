import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "../../styles/detail.css";

import ActorCard from "../../components/ActorCard";
import ReviewList from "../../components/ReviewList";
import ReviewForm from "../../components/ReviewForm";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function DetailPage() {
  const { title } = useParams();  // Mengambil title film dari URL
  const [movies, setMovie] = useState(null); 
  const [actors, setActors] = useState([]); 

  useEffect(() => {
    const fetchMovieDetail = async () => {

        const token = sessionStorage.getItem('UserToken'); // Ambil token dari sessionStorage
       
        try {
            const response = await fetch(`http://localhost:5000/api/movies/title/${title}`, {
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gunakan token yang benar
              }
            });
            
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();  // Langsung ambil data sebagai JSON

            console.log('Movie Data:', data);

            // Validasi data sebelum set state
            if (data && data.title) {
                setMovie(data);  // Simpan data ke state
            } else {
                console.error('Invalid movie data:', data);
            }

            if (data.id_movie) {
              const actorResponse = await fetch(`http://localhost:5000/api/movies/${data.id_movie}/actors`);
              const actorData = await actorResponse.json();
              console.log('Actors:', actorData);
              setActors(actorData);  // Simpan data aktor ke state
            }

        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    fetchMovieDetail();
}, [title]);  // useEffect dijalankan setiap kali title berubah

const getYoutubeEmbedUrl = (url) => {
  const videoId = url.split('v=')[1];
  const ampersandPosition = videoId ? videoId.indexOf('&') : -1;
  if (ampersandPosition !== -1) {
    return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
  }

  return `https://www.youtube.com/embed/${videoId}`;
};
  
  if (!movies) {
      return <div>Loading...</div>;  // Menampilkan loading sementara
  }

const genreList = movies.genres && movies.genres.length > 0 ? movies.genres.join(', ') : 'Tidak ada genre';
const countryList = movies.countries && movies.countries.length > 0 ? movies.countries.join(', ') : 'Tidak ada country';


  return (
    <div>
      <Header />
      <div className="container mt-6">
          {/* Title Section */}
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <span style={{ color: '#FFFFFF', fontFamily: 'Oswald', fontSize: '40px' }}>Detail </span>
              <span style={{ color: '#C6A628', fontFamily: 'Oswald', fontSize: '40px' }}>Information</span>
            </div>
          </div>
          <div className="row justify-content-center align-items-start mt-4">
            {/* Image Section */}
            <div className="col-md-3">
              <img
                src={movies.poster || '/images/default-movie.png'} // Use src with a fallback to default image
                alt={movies.title}
                className="movie-image rounded-image"
                style={{
                  height: '450px',
                  width: '250px',
                  objectFit: 'cover', // Ensures the image fits nicely
                }}
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if default image fails
                  e.target.src = '/images/default-movie.png'; // Set the fallback image
                }}
              />
            </div>
            {/* Drama Details Section */}
            <div className="col-md-6" style={{ marginLeft: '50px' }}>
              <h2 className="drama-title">{movies.title}</h2>
              <p><strong>Other Titles:</strong> {movies.alt_title}</p>
              <p><strong>Year:</strong> {movies.year}</p>
              <p><strong>Synopsis:</strong> {movies.synopsis}</p>
              <p><strong>Genre:</strong> {genreList}</p>
              <p><strong>Country:</strong> {countryList}</p>
              <p><strong>Rating:</strong> {movies.rating}</p>
            </div>
          </div>

          {/* Subheading Actors */}
          <div className="mt-4">
            <h3 style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '28px' }}>Actors</h3>
          </div>

          {/* Actor Cards Section */}
        <div className="row mt-4">
          {actors.length > 0 ? (
            actors.map((actors, index) => (
              <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                <ActorCard name={actors.name} imageUrl={actors.photo} />
              </div>
            ))
          ) : (
            <p>No actors available for this moview.</p>
          )}
        </div>

          {/* Subheading Youtube Trailer */}
          <div className="mt-4">
            <h3 style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '28px' }}>Trailer</h3>
          </div>

          {/* Video Placeholder Section */}
          <div className="fullscreen-video mt-4">
            {/* Jika URL dari YouTube, tampilkan iframe, jika tidak tampilkan gambar default */}
            {movies.trailer && movies.trailer.includes('youtube.com') ? (
              <iframe
                className="w-100 h-100"
                src={getYoutubeEmbedUrl(movies.trailer)}
                allowFullScreen
                title="YouTube Video"
              ></iframe>
            ) : (
              <img
                className="w-100 h-100"
                src="/images/video-not-found.png"
                alt="Default Trailer"
              />
            )}
          </div>

          {/* Review Section */}
          <div className="mt-5">
            <div className="row justify-content-between">
              <div className="col-6 d-flex align-items-center">
                <h3 style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '28px' }}>People think about this</h3>
              </div>
              <div className="col-6 d-flex justify-content-end align-items-center">
                {/* StarDropdown*/}
              </div>
            </div>
          </div>

          <ReviewList id_movie={movies.id_movie} />
          <ReviewForm id_movie={movies.id_movie} />
      </div>
      <Footer />
    </div>
  );
}

export default DetailPage;