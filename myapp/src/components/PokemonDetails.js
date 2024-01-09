// PokemonDetails.js
import React from 'react';
import "./style.css"
const PokemonDetails = ({ pokemon, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{pokemon.name}</h2>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default PokemonDetails;
