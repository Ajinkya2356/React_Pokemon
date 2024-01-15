import React from "react";
import styles from "./search.module.css"
const SearchPokemon = ({ searchQuery, handleSearch }) => {

  return (
    <div
      className={styles.searchFilter}

    >
      <h4 id={styles.searchTitle}>Search by</h4>
      <div >
        <input
          className={styles.searchInput}
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
