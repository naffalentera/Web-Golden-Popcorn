const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

// Override global fetch
const originalFetch = window.fetch;

window.fetch = (url, options = {}) => {
  // Cek apakah URL sudah absolut, jika tidak tambahkan SERVER_URL
  const finalURL = url.startsWith("http") ? url : `${SERVER_URL}${url}`;
  return originalFetch(finalURL, options);
};
