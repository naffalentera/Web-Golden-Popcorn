import { Modal } from "react-bootstrap";
import ActorCard from "./ActorCard";

const getYoutubeEmbedUrl = (url) => {
  const videoId = url.split('v=')[1];
  const ampersandPosition = videoId ? videoId.indexOf('&') : -1;
  if (ampersandPosition !== -1) {
    return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
  }
  return `https://www.youtube.com/embed/${videoId}`;
};

const EditMovieModal = ({ show, handleClose, movie, actors, handleApprove, handleDelete }) => {
  if (!movie) return null; // Avoid rendering if no movie is selected

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="justify-content-center">
        <Modal.Title className="w-100 text-center">
          <button
            className="btn text-white mx-2"
            style={{ backgroundColor: "#C6A628" }}
            onClick={() => handleApprove(movie)}
          >
            Approve
          </button>
          <button className="btn btn-danger mx-2" onClick={() => handleDelete(movie)}>
            Delete
          </button>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row">
          {/* Movie Poster Section */}
          <div className="col-md-4">
            <img
              src={movie.poster || '/images/default-movie.png'} // Default image if no poster available
              alt={movie.title}
              className="rounded-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-movie.png';
              }}
            />
          </div>

          {/* Movie Details Section */}
          <div className="col-md-8" style={{ color: '#000' }}>
            <h2 className="drama-title">{movie.title}</h2>
            <p><strong>Other Titles:</strong> {movie.alt_title || "N/A"}</p>
            <p><strong>Year:</strong> {movie.year || "N/A"}</p>
            <p><strong>Genres:</strong> {movie.genres ? movie.genres.join(", ") : "N/A"}</p>
            <p><strong>Synopsis:</strong> {movie.synopsis || "No synopsis available"}</p>
            <p><strong>Status:</strong> {movie.status}</p>
          </div>
        </div>

        {/* Actor Section */}
        <div className="mt-4">
          <h3 style={{ color: '#000000', fontFamily: 'Plus Jakarta Sans', fontSize: '28px' }}>Actors</h3>
          <div className="row mt-3">
          {movie.actors && movie.actors.map((actor, index) => (
              <div className="col-4 mb-3" key={index}>
                <ActorCard 
                  name={actor.name} 
                  imageUrl={actor.photo || '/images/default-actor.png'} 
                  style={{ height: '135px', width: '115px' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Trailer Section */}
        <div className="mt-4">
          <h3 style={{ color: '#000000', fontFamily: 'Plus Jakarta Sans', fontSize: '28px' }}>Trailer</h3>
          <div className="fullscreen-video mt-3" style={{ width: '100%', height: '400px' }}>
            {movie.trailer && movie.trailer.includes('youtube.com') ? (
              <iframe
                className="w-100 h-100"
                src={getYoutubeEmbedUrl(movie.trailer)}
                allowFullScreen
                title="YouTube Video"
              ></iframe>
            ) : (
              <img
                className="w-100 h-100"
                src="/images/video-not-found.png"
                alt="Default Trailer"
              />
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditMovieModal;
