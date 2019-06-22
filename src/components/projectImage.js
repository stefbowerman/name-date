import React, { createRef } from 'react'
import styles from '../templates/project.module.scss'

class ProjectImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const full = this.props.image.full;
    const placeholder = this.props.image.placeholder;

    return (
      <div className={styles.projectImageWrapper}>
        <div className={styles.projectImage}>
          <img src={placeholder.src} className={styles.projectImagePlaceholder} />
          <img src={full.src} className={styles.projectImageFull} />
        </div>
      </div>
    )
  }
}

export default ProjectImage