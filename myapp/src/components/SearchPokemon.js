import React, { useState } from "react";
import "./Pokemon.css"
import TypeFilter from "./TypeFilter";
const SearchPokemon = ({ searchQuery, handleSearch }) => {

  return (
    <div
      style={{
        // display: "inline-block",
        padding: 0,
        margin: 0,

      }}
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
