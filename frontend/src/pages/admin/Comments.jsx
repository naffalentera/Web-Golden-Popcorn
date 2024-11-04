import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar';
import Swal from 'sweetalert2';

const Comments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("None");
  const [showCount, setShowCount] = useState(10);
  const [comments, setComments] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch data dari API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/comments'); // Ganti 'API_ENDPOINT' dengan URL API Anda
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchTerm, showCount]);
  

  // Filter berdasarkan status dan jumlah tampilan & pencarian berdasarkan username dan movie
  const filteredCommentsData = comments
    .filter((comment) => {
      if (selectedStatus !== "None" && comment.status !== selectedStatus.toLowerCase()) {
        return false;
      }
      return (
        comment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.movie.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  
  const totalPages = Math.max(1, Math.ceil(filteredCommentsData.length / showCount));
  const filteredComments = filteredCommentsData.slice((currentPage - 1) * showCount, currentPage * showCount);
  

    // Handler untuk mengatur komentar yang dipilih
  const handleSelectComment = (comment) => {
    setSelectedComments((prevSelected) =>
      prevSelected.includes(comment)
        ? prevSelected.filter((c) => c !== comment)
        : [...prevSelected, comment]
    );
  };

  // Handler untuk Select All
  const handleSelectAll = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments);
    }
  };

  // Handler Approve dan Delete
  const handleApprove = async () => {
    try {
      const commentsToApprove = selectedComments.filter(
        (comment) => comment.status === "unapproved"
      );
  
      await Promise.all(
        commentsToApprove.map(async (comment) => {
          const response = await fetch(`http://localhost:5000/api/comments/${comment.id_comment}/approve`, {
            method: 'PUT',
          });
          if (!response.ok) {
            throw new Error(`Failed to approve comment with ID ${comment.id_comment}`);
          }
        })
      );
  
      // Fetch comments data again after approval to update the state
      const response = await fetch('http://localhost:5000/api/comments'); // Load updated comments from backend
      const updatedComments = await response.json();
      setComments(updatedComments); // Update comments in state with the latest data
  
      setSelectedComments([]); // Reset selected comments

      Swal.fire({
        icon: 'success',
        title: 'Approved!',
        text: 'Selected comments have been successfully approved.',
      });
    } catch (error) {
      console.error("Error approving comments:", error);
        Swal.fire({
          icon: 'error',
          title: 'Approval Failed',
          text: `An error occurred while approving comments: ${error.message}`,
        });
    }
  };
  

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E50914',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (result.isConfirmed) {
      try {
        // Jika pengguna menekan "Yes", hapus komentar yang dipilih
        await Promise.all(
          selectedComments.map(async (comment) => {
            const response = await fetch(`http://localhost:5000/api/comments/${comment.id_comment}`, {
              method: 'DELETE',
            });
            if (!response.ok) {
              throw new Error(`Failed to delete comment with ID ${comment.id_comment}`);
            }
          })
        );
  
  
        // Hapus komentar yang dipilih dari state comments
        setComments((prevComments) =>
          prevComments.filter((comment) => !selectedComments.includes(comment))
        );
        setSelectedComments([]);
      } catch (error) {
        console.error("Error deleting comments:", error);
      }
    }
  };  

  return (
    <div className="container-box">
      {/* Sidebar Section */}
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box">    
        {/* Title Section */}
        <div className="mt-4 mb-4">
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>CMS Comments</h3>
        </div>

        {/* Filter Section */}
        <div className="row mb-3">
          <div className="col-12 col-lg-4 col-md-4 d-flex align-items-center mt-2">
            <label htmlFor="filter" className="me-3" style={{ whiteSpace: "nowrap" }}>Filtered by </label>
            <select
              // name="filter"
              id="filter"
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="None">None</option>
              <option value="Approved">Approved</option>
              <option value="Unapproved">Unapproved</option>
            </select>
          </div>

          <div className="col-12 col-lg-2 col-md-2 d-flex align-items-center mt-2">
            <label htmlFor="showCount" className="me-2">Shows </label>
            <select
              id="showCount"
              value={showCount}
              className="form-select"
              onChange={(e) => setShowCount(e.target.value)}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="col-12 col-lg-4 col-md-4 d-flex align-items-center mt-2 ms-auto">
            <label htmlFor="search" className="me-2">
              Search
            </label>
            <input
              type="text"
              id="search"
              className="form-control"
              placeholder="Search by username or movie"
              value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
              <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedComments.length === filteredComments.length}
                  />
                </th>
                <th>Username</th>
                <th>Rate</th>
                <th>Movie</th>
                <th>Comments</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment, index) => (
                <tr key={comment.id_comment}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment)}
                      onChange={() => handleSelectComment(comment)}
                    />
                  </td>
                  <td>{comment.username}</td>
                  <td>
                    {"★".repeat(comment.rate)} {/* Menampilkan rate sebagai bintang */}
                  </td>
                  <td>{comment.movie}</td>
                  <td>{comment.comment}</td>
                  <td>{comment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-start mt-4">
          <button className="btn btn-golden"
            onClick={handleApprove}
            disabled={selectedComments.length === 0}
            style={{
              marginRight: "10px"
            }}
          >
            Approve
          </button>
          <button className="btn-red"
            onClick={handleDelete}
            disabled={selectedComments.length === 0}            
          >
            Delete
          </button>
        </div>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center gap-2 align-items-center mb-3 mt-4">
          <button className="btn btn-golden"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button className="btn btn-golden"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
