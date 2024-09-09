import React, { useState } from "react";
import "../styles/detail.css";

import ActorCard from "../components/ActorCard";
import StarDropdown from "../components/StarDropdown";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";

function Detail() {
  const [filter, setFilter] = useState(5);

  // Handler for the select change event
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const actors = [
    { name: "Actor 1", imageUrl: "/images/contoh.png" },
    { name: "Actor 2", imageUrl: "/images/contoh.png" },
    { name: "Actor 3", imageUrl: "/images/contoh.png" },
    { name: "Actor 4", imageUrl: "/images/contoh.png" },
    { name: "Actor 5", imageUrl: "/images/contoh.png" },
    { name: "Actor 6", imageUrl: "/images/contoh.png" },
    { name: "Actor 7", imageUrl: "/images/contoh.png" },
    { name: "Actor 8", imageUrl: "/images/contoh.png" },
    { name: "Actor 9", imageUrl: "/images/contoh.png" },
    { name: "Actor 10", imageUrl: "/images/contoh.png" },
  ];

  return (
    <div>
      <header
        className="border-bottom border-2 border-warning"
        style={{ backgroundColor: "rgba(220, 194, 47, 0.2)" }}
      >
        <nav className="container-fluid header-container d-flex justify-content-between align-items-center py-3">
          <div className="logo my-logo fw-bold d-flex align-items-center">
            <img
              src="/images/image_no_background.png"
              alt="Logo"
              className="me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <strong>GoldenPopcorn</strong>
          </div>
          <div className="search-container d-flex align-items-center w-25">
            <input type="text" className="form-control" placeholder="Search" />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div>
            <button className="btn btn-outline-warning me-2">Sign Up</button>
            <button className="btn btn-warning">Log In</button>
          </div>
        </nav>
      </header>

      <div className="container mt-5">
        <div className="row">
          {/* Image Section */}
          <div className="col-md-3">
            <div
              className="drama-image"
              style={{
                backgroundImage: "url('/images/film.jpg')",
                height: "450px",
                width: "250px",

                backgroundPosition: "",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
          {/* Drama Details Section */}
          <div className="col-md-6">
            <h2 className="drama-title">Title of the Drama</h2>
            <p>
              <strong>Other Titles:</strong> Title 2, Title 3
            </p>
            <p>
              <strong>Year:</strong> Spring 2025
            </p>
            <p>
              <strong>Synopsis:</strong> Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Pellentesque varius velit eu velit facilisis, id
              fermentum mauris convallis.
            </p>
            <p>
              <strong>Writer:</strong> Writer Name
            </p>
            <p>
              <strong>Genre:</strong> Thriller
            </p>
            <p>
              <strong>Director:</strong> Director Name
            </p>
            <p>
              <strong>Rating:</strong> 9.5/10
            </p>
            <p>
              <strong>Availability:</strong> Netflix
            </p>
          </div>
        </div>

        {/* Actor Cards Section */}
        <div className="row mt-2">
          {actors.map((actor, index) => (
            <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
              <ActorCard name={actor.name} imageUrl={actor.imageUrl} />
            </div>
          ))}
        </div>

        {/* Video Placeholder Section */}
        <div className="fullscreen-video">
          <iframe
            className="w-100 h-100"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            allowFullScreen
            title="YouTube Video"
          ></iframe>
        </div>

        {/* Review Section */}
        <div className="mt-3">
          <div className="row justify-content-between">
            <div className="col-6 d-flex align-items-center">
              <h4>(4) People think about this drama</h4>
            </div>
            <div className="col-6 d-flex justify-content-end align-items-center">
              <StarDropdown />
            </div>
          </div>
        </div>

        <ReviewList />

        {/* Review Form Section */}
        <ReviewForm />
      </div>

      <footer className="bg-light text-center py-3 border-top border-2 border-warning">
        <p>Website berisi review film seluruh dunia</p>
        <p>Copyright ©2024, All Right Reserved, TIRANA.</p>
      </footer>
    </div>
  );
}

export default Detail;
