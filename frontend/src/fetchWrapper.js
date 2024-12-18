const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const originalFetch = window.fetch;

window.fetch = (url, options = {}) => {
  const finalURL = url.startsWith("http") ? url : `${SERVER_URL}${url}`;
  console.log(`Fetching: ${finalURL}`); // Debugging log
  return originalFetch(finalURL, options);
};
