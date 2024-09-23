// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// function EmailConfirmationPage() {
//   const [status, setStatus] = useState('Loading...');
//   const query = new URLSearchParams(useLocation().search);
//   const token = query.get('token');

//   useEffect(() => {
//     // Verify the token with the backend
//     const verifyToken = async () => {
//       try {
//         await axios.get(`/api/confirm-email?token=${token}`);
//         setStatus('Your email has been confirmed successfully!');
//       } catch (error) {
//         setStatus('Invalid or expired token.');
//       }
//     };

//     if (token) {
//       verifyToken();
//     } else {
//       setStatus('Invalid request.');
//     }
//   }, [token]);

//   return (
//     <div className="email-confirmation-page" style={{ padding: '20px' }}>
//       <h2>Email Confirmation</h2>
//       <p>{status}</p>
//     </div>
//   );
// }

// export default EmailConfirmationPage;
