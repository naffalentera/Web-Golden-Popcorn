import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/detail.css';
import { Row, Col, Card } from 'react-bootstrap';

const DashboardPage = () => {
  const [admins, setAdmins] = useState([]);

  // Fetch admin data from API
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admins');
        const data = await response.json();
        setAdmins(data); // Set data admin
      } catch (error) {
        console.error('Error fetching admin users:', error);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <div className="container-box">
      {/* Sidebar Section*/}
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box">    
        {/* Title Section*/}
        <div className="mt-4 mb-4">
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px', marginLeft: '13px' }}>Admin Dashboard</h3>
        </div>

        {admins.length > 0 ? (
          <Card className="p-4 shadow-sm rounded">
            {admins.map((user) => (
              <Row key={user.id_user} className="mb-4">
                <Col md={12}>
                  <img
                    src={`/images/default-actor.jpg`}
                    alt="Profile Avatar"
                    className="rounded-circle"
                    width="170"
                    height="170"
                  />
                </Col>
                <Col md={12} className="mt-4">
                  <div className="card-admin mt-5">
                    <h3>Personal Information</h3>
                      <Col md={6}>
                        <div className="info-label">Username:</div>
                      </Col>
                      <Col md={6}>
                        <div className="info-value">{user.username}</div>
                      </Col>
                      <Col md={6}>
                        <div className="info-label">Email:</div>
                      </Col>
                      <Col md={6}>
                        <div className="info-value">{user.email}</div>
                      </Col>
                      <Col md={6}>
                        <div className="info-label">Role:</div>
                      </Col>
                      <Col md={6}>
                        <div className="info-value">{user.role}</div>
                      </Col>
                      <Col md={6}>
                        <div className="info-label">User ID:</div>
                      </Col>
                      <Col md={6}>
                        <div className="info-value">{user.id_user}</div>
                      </Col>
                  </div>
                </Col>
              </Row>
            ))}
          </Card>
        ) : (
          <p>No users available</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
