import React from "react";

const TypeFilter = ({ searchType, handleSearch }) => {
  return (
    <div>
      <select
        style={{ width: "300px" }}
        defaultValue=""
        value={searchType}
        onChange={(e) => handleSearch(e)}
      >
        <option value="" disabled hidden>
          Normal+5 more
        </option>
        <option value="Normal">Normal </option>
        <option value="Fighting">Fighting </option>
        <option value="Flying">Flying </option>
        <option value="Poison">Poison </option>
        <option value="Ground">Ground </option>
        <option value="Rock">Rock </option>
      </select>
    </div>
  );
};

export default TypeFilter;
