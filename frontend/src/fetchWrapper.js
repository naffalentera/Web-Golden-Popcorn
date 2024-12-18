const SERVER_URL =
  process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const originalFetch = window.fetch;

window.fetch = (url, options = {}) => {
  // Biarkan URL absolut tetap digunakan
  const finalURL = url.startsWith("http")
    ? url // Jika URL absolut, gunakan langsung
    : `${SERVER_URL}${url}`; // Jika relatif, tambahkan SERVER_URL

  console.log(`Fetching: ${finalURL}`); // Debugging log
  return originalFetch(finalURL, options);
};
