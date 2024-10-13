import React, { useState, useEffect } from 'react';

const renderStars = (count) => {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < count ? "text-warning" : "text-muted"}>
      &#9733;
    </span>
  ));
};

const ReviewList = ({ id_movie }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(`http://localhost:5000/api/movies/${id_movie}/comments`);
      const data = await response.json();
      setReviews(data);
    };    

    fetchReviews();
  }, [id_movie]);

  return (
    <div className="mt-4">
      <ul className="list-unstyled">
        {reviews.length > 0 ? (
          reviews.map((reviews, index) => (
            <li key={index} className="rating mb-3">
              <div className="d-flex align-items-center">
                <span className="review-author me-2"><strong>{reviews.username}</strong>:</span>
                <span className="review-stars">{renderStars(reviews.rate)}</span>
              </div>
              <p>{reviews.comment}</p>
            </li>
          ))
        ) : (
          <p>No reviews yet. Be the first to comment!</p>
        )}
      </ul>
    </div>
  );
};

export default ReviewList;
