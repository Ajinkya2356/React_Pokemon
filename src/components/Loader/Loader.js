import React from 'react'
import styles from './loader.module.css'
const Loader = () => {
    const image = "https://www.freepnglogos.com/uploads/pokeball-png/pokeball-vector-mangotangofox-deviantart-25.png"
    return (
        <div className={styles.loader}>
            <img className={styles.loaderimg} src={image} alt="" />
        </div>
    )
}

export default Loader
