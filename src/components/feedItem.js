import React from 'react'
import Link from 'gatsby-link'
import Img from 'gatsby-image'
import styles from './feedItem.module.scss'

class FeedItem extends React.Component {
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
    const orientation = (this.props.image.resize.height > this.props.image.resize.width ? 'Portrait' : 'Landscape')
    let className = `${styles.feedItem} ${styles['feedItem' + orientation]}`;

    return (
      <div className={className} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <Link to={`/project/${project.slug}`}>
          <img src={image.resize.src} alt={project.title}/>
        </Link>
        {project.caption != undefined &&
          <div
            className={styles.feedItemCaption}
            style={ { opacity: (this.state.isHovering ? 1 : 0) } }
            dangerouslySetInnerHTML={{
              __html: project.caption.childMarkdownRemark.html,
            }}
          />
        }
        <div className={styles.feedItemTitle} style={ { opacity: (this.state.isHovering ? 1 : 0) } }>{project.title}</div>
      </div>
    )
  }
}

export default FeedItem