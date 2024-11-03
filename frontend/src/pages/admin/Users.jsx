import React, { useState, useEffect  } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/detail.css';
import Swal from 'sweetalert';

const Users = () => {
  const [newUser, setNewUser] = useState({ username: "", email: "" });
  const [users, setUsers] = useState([]);

  // Fetch users data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);// Update state dengan data aktor dari backend
        console.log("Fetched users:", data); // Debugging
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (newUser.username && newUser.email) {
      setUsers([...users, { ...newUser, firstEmailSent: false }]);
      setNewUser({ username: "", email: "" });
    }
  };

// Fungsi untuk mengubah status suspend
const handleSuspend = async (user) => {
  try {
    const response = await fetch(`http://localhost:5000/api/user/suspend/${user.id_user}`, {
      method: 'PUT',
    });
    
    if (response.ok) {
      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((u) => u.id_user === user.id_user ? { ...u, is_suspended: !u.is_suspended } : u)
      );
      Swal(`User ${updatedUser.user.is_suspended ? 'disuspend' : 'di-unsuspend'} dengan sukses`, { icon: "success" });
    } else {
      const errorData = await response.json();
      Swal(errorData.message || "Gagal mengubah status suspend", { icon: "error" });
    }
  } catch (error) {
    console.error('Error suspending user:', error);
    Swal("Gagal mengubah status suspend. Coba lagi.", { icon: "error" });
  }
};

  // Fungsi untuk menghapus user dengan konfirmasi SweetAlert
  const handleDeleteUser = (user) => {
    Swal({
      title: `Are you sure you want to delete "${user.username}"?`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`http://localhost:5000/api/user/${user.id_user}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            setUsers((prevUsers) => prevUsers.filter((u) => u.id_user !== user.id_user));
            Swal("User deleted successfully!", { icon: "success" });
          } else {
            const errorData = await response.json();
            Swal(errorData.message || "Failed to delete user", { icon: "error" });
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal("Failed to delete user. Try again.", { icon: "error" });
        }
      }
    });
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
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>CMS Users</h3>
        </div>

        {/* Form Section */}
        <div className="d-flex justify-content-start mt-4">
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px",
              width: "250px",
            }}
            placeholder="Enter username"
          />
          <input
            type="text"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px",
              width: "250px",
            }}
            placeholder="Enter email"
          />
          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#C6A628", borderColor: "#C6A628" }}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        {/* Users Table */}
        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                      <button
                      onClick={() => handleSuspend(user)}
                      style={{
                        color: user.is_suspended ? "#008000" : "#FF0000", // Hijau untuk unsuspend, Merah untuk suspend
                        background: "none",
                        border: "none",
                        padding: "0",
                        textDecoration: "underline",
                        cursor: "pointer"
                      }}
                    >
                      {user.is_suspended ? "Unsuspend" : "Suspend"}
                    </button>
                    <span> | </span>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      style={{
                        color: "#FF0000",
                        background: "none",
                        border: "none",
                        padding: "0",
                        textDecoration: "underline",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
