import React, { useState, useEffect } from 'react'
import Img from 'gatsby-image'
import styles from '../templates/project.module.scss'

const ProjectImage = ({ image, onLoad = () => {} }) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loaded && onLoad()
  }, [loaded])

  return (
    <div
      className={styles.projectImageWrapper}
      onDragStart={e => e.preventDefault()}
    >
      <div className={styles.projectImage}>
        <img
          src={image.placeholder.src}
          className={styles.projectImagePlaceholder}
        />
        <Img
          fluid={image.fluid}
          className={[styles.projectImageFull, `${loaded ? styles.isLoaded : '' }`].join(' ')}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  )
}

export default ProjectImage