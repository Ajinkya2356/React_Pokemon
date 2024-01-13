import React from 'react'
import './overlaystats.css'
import Stats from './Stats'
const OverlayStats = () => {
    return (
        <div className='overlay'>
            <ul>
                <li>
                    <h3>HP</h3>
                    <Stats />
                </li>
                <li>
                    <h3>Attack</h3>
                    <Stats />
                </li>
                <li><h3>Defense</h3>
                    <Stats /></li>
                <li><h3>Speed</h3>
                    <Stats /></li>
                <li><h3>Sp.Attack</h3>
                    <Stats /></li>
                <li><h3>Sp.Defense</h3>
                    <Stats /></li>
            </ul>
        </div>
    )
}

export default OverlayStats
