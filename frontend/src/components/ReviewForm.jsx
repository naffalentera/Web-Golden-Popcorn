import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import Swal from 'sweetalert2';

const ReviewForm = ({ id_movie }) => {
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(5);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('UserToken'); // Ambil token JWT dari sessionStorage
    // setIsLoggedIn(!!token);

    // Pastikan token diambil dengan benar
    if (!token) {
      navigate('/login');
      console.error('Token is missing!');
      return;
    }
    

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Kirim token JWT di header
        },
        body: JSON.stringify({ comment, rate, id_movie }),
      });

      const data = await response.json();
      console.log('Comment added:', data);

      // Tampilkan alert swal setelah komentar berhasil dikirim
      Swal.fire({
        title: 'Comment Submitted!',
        text: 'Please wait for admin approval before your comment is visible.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Reset form setelah komentar dikirim
      setComment('');
      setRate(5);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < count ? "text-warning" : "text-muted"}
        onClick={() => setRate(index + 1)} // Set rating based on click
      />
    ));
  };

  return (
    <div className="my-4">
      <h4>Add Yours!</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <div>{renderStars(rate)}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            id="message"
            className="form-control"
            rows="3"
            value={comment} // Mengambil nilai komentar dari state
            onChange={(e) => setComment(e.target.value)} // Update state komentar saat input berubah
            placeholder="Your thoughts..."
          ></textarea>
        </div>
        <button className="btn btn-golden mt-2" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
