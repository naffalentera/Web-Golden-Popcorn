import React from "react";
import "../styles/detail.css";

const ActorCard = ({ name, imageUrl }) => {
  return (
    <div className="actor-card text-center">
      <img
        src={imageUrl}
        alt={`${name}'s portrait`}
      />
      <div className="card-body">
        <p>{name}</p>
      </div>
    </div>
  );
};

export default ActorCard;
