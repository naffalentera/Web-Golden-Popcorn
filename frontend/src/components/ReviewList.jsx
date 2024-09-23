// ReviewList.jsx
import React from "react";

const reviews = [
  {
    name: "Alice",
    stars: 5,
    text: "This drama was amazing! Highly recommended.",
  },
  {
    name: "Bob",
    stars: 5,
    text: "Fantastic storyline!",
  },
  {
    name: "Charlie",
    stars: 4,
    text: "Almost perfect, just a few things missing.",
  },
  {
    name: "Dave",
    stars: 1,
    text: "Bad film!",
  },
];

const renderStars = (count) => {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < count ? "text-warning" : "text-muted"}>
      &#9733;
    </span>
  ));
};

function ReviewList() {
  return (
    <div className="mt-4">
      <ul className="list-unstyled">
        {reviews.map((review, index) => (
          <li key={index} className="rating mb-3">
            <div className="d-flex align-items-center">
              <span className="review-author me-2"><strong>{review.name}</strong>:</span>
              <span className="review-stars">{renderStars(review.stars)}</span>
            </div>
            <p>{review.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewList;
