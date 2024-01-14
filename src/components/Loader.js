import React from 'react'
import './loader.css'
const Loader = () => {
    const image = "https://www.freepnglogos.com/uploads/pokeball-png/pokeball-vector-mangotangofox-deviantart-25.png"
    return (
        <div className="loader">
            <img className='loaderimg' src={image} alt="" />
        </div>
    )
}

export default Loader
