import React from 'react'
import Img from 'gatsby-image'
import styles from '../templates/project.module.scss'

const ProjectImage = ({ image }) => {
  return (
    <div className={styles.projectImageWrapper}>
      <div className={styles.projectImage}>
        <img src={image.placeholder.src} className={styles.projectImagePlaceholder} />
        <Img fluid={image.fluid} className={styles.projectImageFull} />
      </div>
    </div>
  )
}

export default ProjectImage