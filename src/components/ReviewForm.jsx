// ReviewForm.jsx
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5); // Default rating
  const [message, setMessage] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleRatingChange = (value) => setRating(value);
  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the review logic here
    console.log("Name:", name);
    console.log("Rating:", rating);
    console.log("Message:", message);
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < count ? "text-warning" : "text-muted"}
        onClick={() => handleRatingChange(index + 1)}
      />
    ));
  };

  return (
    <div className="my-4 ">
      <h4>Add Yours!</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={handleNameChange}
            placeholder="Your name..."
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <div>{renderStars(rating)}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            id="message"
            className="form-control"
            rows="3"
            value={message}
            onChange={handleMessageChange}
            placeholder="Your thoughts..."
          ></textarea>
        </div>
        <button className="btn btn-primary mt-2" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
