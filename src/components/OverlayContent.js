import React from 'react'
import './overlay.css'
const OverlayContent = ({ searchType, handleSearch }) => {
    const types = ["Normal", "Flying", "Ground", "Bug", "Steel", "Water", "Electric", "Ice", "Dark", "Unknown"]
    const types2 = ["Fighting", "Poison", "Rock", "Ghost", "Fire", "Grass", "Psychic", "Dragon", "Fairy", "Shadow"]
    return (
        <div className='overlay'>
            <div style={{ width: "40%", marginLeft: "15px" }}>
                {types.map((type) => (
                    <p>&nbsp;&nbsp;<input type="checkbox" value={type}onChange={(e) => handleSearch(e)} />&nbsp;&nbsp;{type}</p>
                ))}
            </div>
            <div style={{ width: "40%" }}>
                {
                    types2.map((type) => (
                        <p>&nbsp;&nbsp;<input type="checkbox" value={type} onChange={(e) => handleSearch(e)} />&nbsp;&nbsp;{type}</p>
                    ))
                }
            </div>
        </div>
    )
}

export default OverlayContent
