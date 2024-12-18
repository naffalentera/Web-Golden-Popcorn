const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const originalFetch = window.fetch;

window.fetch = (url, options = {}) => {
  // Cek jika URL sudah absolut, gunakan langsung
  const isAbsoluteURL = url.startsWith("http://") || url.startsWith("https://");
  const finalURL = isAbsoluteURL ? url : `${SERVER_URL}${url}`;

  console.log(`Fetching: ${finalURL}`); // Debugging log
  return originalFetch(finalURL, options);
};
