import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

function StarDropdown() {
  const [filter, setFilter] = useState(5);

  const handleFilterChange = (value, event) => {
    event.preventDefault();
    event.stopPropagation();
    setFilter(value);
    // Additional logic can be added here if needed
  };

  const renderStars = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <FaStar key={index} className="text-warning" />
    ));
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {renderStars(filter)} {filter}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {[5, 4, 3, 2, 1].map((value) => (
          <li key={value} onClick={(e) => handleFilterChange(value, e)}>
            <a className="dropdown-item" href="#">
              {renderStars(value)} {value}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StarDropdown;
