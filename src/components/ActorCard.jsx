import React from "react";

const ActorCard = ({ name, imageUrl }) => {
  return (
    <div className="card text-center h-100">
      <img
        src={imageUrl}
        alt={`${name}'s portrait`}
        className="card-img-top"
        style={{ height: "250px", objectFit: "cover" }}
      />
      <div className="card-body">
        <p className="card-text fw-bold">{name}</p>
      </div>
    </div>
  );
};

export default ActorCard;
