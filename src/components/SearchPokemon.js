import React from "react";
import "./Pokemon.css"
const SearchPokemon = ({ searchQuery, handleSearch }) => {

  return (
    <div
      className="searchFilter"

    >
      <h4 id="searchTitle">Search by</h4>
      <div >
        <input
          className="searchInput"
          placeholder="Name or Number"
          value={searchQuery}
          onChange={handleSearch}
          type="text"
        />

      </div>

    </div>
  );
};

export default SearchPokemon;
