const ActorCard = ({ name, imageUrl }) => {
  return (
    <div className="actor-card text-center">
      <img
        src={imageUrl || "/images/default-actor.jpg"}  // Fallback jika imageUrl kosong
        alt={`${name}'s portrait`}
        className="actor-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/default-actor.jpg";  // Fallback jika gambar gagal di-load
        }}
      />
      <div className="card-body">
        <p>{name}</p>
      </div>
    </div>
  );
};

export default ActorCard;