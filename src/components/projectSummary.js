import React from 'react'
import Link from 'gatsby-link'
import Img from 'gatsby-image'
import styles from './projectSummary.module.css'

class ProjectSummary extends React.Component {
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
    console.log(project)

    return (
      <div className={styles.projectSummary} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <img src={project.featuredImage.resize.src} />
        <div
          className={styles.projectSummaryCaption}
          style={ { opacity: (this.state.isHovering ? 1 : 0) } }
          dangerouslySetInnerHTML={{
            __html: project.caption.childMarkdownRemark.html,
          }}
        />
        <Link to={`/project/${project.slug}`} style={ {display: 'none'} }>{project.title}</Link>
      </div>
    )
  }
}

export default ProjectSummary