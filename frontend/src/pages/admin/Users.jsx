import React, { useState, useEffect  } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/detail.css';
import Swal from 'sweetalert';

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch users data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data); // Update state with data from backend
        console.log("Fetched users with updated suspend status:", data); // Debugging
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);  


// Function to suspend a user
const handleSuspend = (user) => {
  Swal({
    title: `Are you sure you want to suspend "${user.username}"?`,
    icon: "warning",
    buttons: ["Cancel", "Suspend"],
    dangerMode: true,
  }).then(async (willSuspend) => {
    if (willSuspend) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/suspend/${user.id_user}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id_user === user.id_user ? { ...u, is_suspended: true } : u
            )
          );
          Swal("User suspended successfully!", { icon: "success" });
        } else {
          const errorData = await response.json();
          Swal(errorData.message || "Failed to change suspend status", { icon: "error" });
        }
      } catch (error) {
        console.error("Error suspending user:", error);
        Swal("Failed to change suspend status. Please try again.", { icon: "error" });
      }
    }
  });
};


const handleUnsuspend = (user) => { 
  Swal({
    title: `Are you sure you want to unsuspend "${user.username}"?`,
    icon: "warning",
    buttons: ["Cancel", "Unsuspend"],
    dangerMode: true,
  }).then(async (willUnsuspend) => {
    if (willUnsuspend) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/unsuspend/${user.id_user}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id_user === user.id_user ? { ...u, is_suspended: false } : u
            )
          );
          Swal("User unsuspend successfully!", { icon: "success" });
        } else {
          const errorData = await response.json();
          Swal(errorData.message || "Failed to change unsuspend status", { icon: "error" });
        }
      } catch (error) {
        console.error("Error unsuspending user:", error);
        Swal("Failed to change unsuspend status. Please try again.", { icon: "error" });
      }
    }
  });
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

        {/* Users Table */}
        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.is_suspended ? "Suspended" : "Active"}</td>
                <td>
                  {!user.is_suspended && (
                    <button
                      onClick={() => handleSuspend(user)}
                      style={{
                        color: "#4169E1", // Red color for suspend
                        background: "none",
                        border: "none",
                        padding: "0",
                        textDecoration: "underline",
                        cursor: "pointer"
                      }}
                    >
                      Suspend
                    </button>
                  )}

                  {/* Unsuspend button (shows only if user is suspended) */}
                  {user.is_suspended && (
                    <button
                      onClick={() => handleUnsuspend(user)}
                      style={{
                        color: "#008000", // Green color for unsuspend
                        background: "none",
                        border: "none",
                        padding: "0",
                        textDecoration: "underline",
                        cursor: "pointer"
                      }}
                    >
                      Unsuspend
                    </button>
                  )}
                  
                  <span> | </span>
                  
                  {/* Delete button (always visible) */}
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
