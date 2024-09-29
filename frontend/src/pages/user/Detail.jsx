import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "../../styles/detail.css";

import ActorCard from "../../components/ActorCard";
import StarDropdown from "../../components/StarDropdown";
import ReviewList from "../../components/ReviewList";
import ReviewForm from "../../components/ReviewForm";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function DetailPage() {
  const { title } = useParams();  // Mengambil title film dari URL
  const [movie, setMovie] = useState(null);  

  useEffect(() => {
      const fetchMovieDetail = async () => {
          try {
              const response = await fetch(`http://localhost:5000/api/movies/title/${title}`);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const data = await response.json();
              console.log(data); // Debugging untuk melihat data
              setMovie(data);  
          } catch (error) {
              console.error('Error fetching movie details:', error);
          }
      };

      fetchMovieDetail();
  }, [title]);

  if (!movie) {
      return <div>Loading...</div>;  // Menampilkan loading sementara
  }

  const actors = [
    { name: "Actor 1", imageUrl: "/images/actor.jpg" },
    { name: "Actor 2", imageUrl: "/images/actor.jpg" },
    { name: "Actor 3", imageUrl: "/images/actor.jpg" },
    { name: "Actor 4", imageUrl: "/images/actor.jpg" },
    { name: "Actor 5", imageUrl: "/images/actor.jpg" },
    { name: "Actor 6", imageUrl: "/images/actor.jpg" },
    { name: "Actor 7", imageUrl: "/images/actor.jpg" },
    { name: "Actor 8", imageUrl: "/images/actor.jpg" },
    { name: "Actor 9", imageUrl: "/images/actor.jpg" },
    { name: "Actor 10", imageUrl: "/images/actor.jpg" },
  ];

  return (
    <div>
      <Header />
      <div className="container mt-4">
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
              <div
                className="drama-image"
                style={{
                  backgroundImage: `url(${movie.poster})`,
                  height: "450px",
                  width: "250px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
            {/* Drama Details Section */}
            <div className="col-md-6" style={{ marginLeft: '50px' }}>
              <h2 className="drama-title">{movie.title}</h2>
              <p><strong>Other Titles:</strong> {movie.alt_title}</p>
              <p><strong>Year:</strong> {movie.year}</p>
              <p><strong>Synopsis:</strong> {movie.synopsis}</p>
              <p><strong>Genre:</strong> 
                <ul>
                  {movie.genres.map((genre, index) => (
                      <li key={index}>{genre}</li>
                  ))}
                </ul>
              </p>
              <p><strong>Rating:</strong> 9.5/10</p>
            </div>
          </div>

          {/* Subheading Actors */}
          <div className="mt-4">
            <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '28px' }}>Actors</h3>
          </div>

          {/* Actor Cards Section */}
          <div className="row mt-4">
            {actors.map((actor, index) => (
              <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                <ActorCard name={actor.name} imageUrl={actor.imageUrl} />
              </div>
            ))}
          </div>

          {/* Subheading Youtube Trailer */}
          <div className="mt-4">
            <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '28px' }}>Trailer</h3>
          </div>

          {/* Video Placeholder Section */}
          <div className="fullscreen-video mt-4">
            <iframe
              className="w-100 h-100"
              src={`https://www.youtube.com/embed/${movie.trailer}`} // Pastikan trailer adalah id video YouTube
              allowFullScreen
              title="YouTube Video"
            ></iframe>
          </div>

          {/* Review Section */}
          <div className="mt-4">
            <div className="row justify-content-between">
              <div className="col-6 d-flex align-items-center">
                <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '28px' }}>People think about this</h3>
              </div>
              <div className="col-6 d-flex justify-content-end align-items-center">
                <StarDropdown />
              </div>
            </div>
          </div>

          <ReviewList />
          <ReviewForm />
      </div>
      <Footer />
    </div>
  );
}

export default DetailPage;
