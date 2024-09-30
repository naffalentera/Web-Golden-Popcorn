import React, { useState } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal"; // Import React Bootstrap Modal

const Comments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("None");
  const [showCount, setShowCount] = useState(10);
  const [comments, setComments] = useState([
    {
      username: "Nara",
      rate: 4,
      drama: "[2024] Japan - Eye Love You",
      comment: "I love this drama. It taught me a lot about money and finance. Love is not everything. We need to face the reality too. Being stoic is the best.",
      status: "Unapproved",
    },
    {
      username: "Luffy",
      rate: 2,
      drama: "[2024] Japan - Eye Love You",
      comment: "Meh",
      status: "Approved",
    },
    // Add more comments as needed
  ]);

  // Filter berdasarkan status dan jumlah tampilan
  const filteredComments = comments
    .filter((comment) => {
      if (selectedStatus === "None") return true;
      return comment.status === selectedStatus;
    })
    .slice(0, showCount);

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
        <div className="d-flex justify-content-start mt-4">
          <div className="mr-4">
            <label htmlFor="filterStatus">Filtered by: </label>
            <select
              id="filterStatus"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                borderRadius: "10px",
                padding: "10px",
                marginRight: "20px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #C6A628",
              }}
            >
              <option value="None">None</option>
              <option value="Approved">Approved</option>
              <option value="Unapproved">Unapproved</option>
            </select>
          </div>

          <div>
            <label htmlFor="showCount">Shows: </label>
            <select
              id="showCount"
              value={showCount}
              onChange={(e) => setShowCount(e.target.value)}
              style={{
                borderRadius: "10px",
                padding: "10px",
                marginRight: "20px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #C6A628",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>No</th> {/* Kolom No */}
                <th>Username</th>
                <th>Rate</th>
                <th>Drama</th>
                <th>Comments</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment, index) => (
                <tr key={index}>
                  <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                  <td>{comment.username}</td>
                  <td>
                    {"★".repeat(comment.rate)} {/* Menampilkan rate sebagai bintang */}
                  </td>
                  <td>{comment.drama}</td>
                  <td>{comment.comment}</td>
                  <td>{comment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Comments;
