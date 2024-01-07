import React from "react";

const Gender = ({ searchType, handleSearch }) => {
  return (
    <div>
      <select
        style={{ width: "300px" }}
        defaultValue=""
        value={searchType}
        onChange={(e) => handleSearch(e)}
      >
        <option value="" disabled hidden>
          {searchType || "Normal+5 more"}
        </option>
        <option value="Male">Male </option>
        <option value="Fighting">Fighting </option>
        <option value="Flying">Flying </option>
        
      </select>
    </div>
  );
};

export default Gender;
