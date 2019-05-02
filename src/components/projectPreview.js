import React from 'react'
import Link from 'gatsby-link'
import Img from 'gatsby-image'
import styles from './projectPreview.module.scss'

class ProjectPreview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false
    }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }
  onMouseEnter() {
    this.setState({
      isHovering: true
    })
  }
  onMouseLeave() {
    this.setState({
      isHovering: false
    })
  }
  render() {
    const project = this.props.project
    const image = this.props.image
    console.log(this.props)
    console.log(image)
    // console.log(project)

    return (
      <div className={styles.projectPreview} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <Link to={`/project/${project.slug}`}>
          <img src={image.resize.src} alt={project.title}/>
        </Link>
        <div
          className={styles.projectPreviewCaption}
          style={ { opacity: (this.state.isHovering ? 1 : 0) } }
          dangerouslySetInnerHTML={{
            __html: project.caption.childMarkdownRemark.html,
          }}
        />
        <div className={styles.projectPreviewTitle} style={ { opacity: (this.state.isHovering ? 1 : 0) } }>{project.title}</div>
      </div>
    )
  }
}

export default ProjectPreview