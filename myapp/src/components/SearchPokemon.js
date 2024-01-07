import React from 'react'

const SearchPokemon = ({searchQuery,handleSearch}) => {
  return (
    <div>
      <h3>Search Pokemon</h3>
    <input value={searchQuery} onChange={handleSearch} type="text" />
    </div>
  )
}

export default SearchPokemon
