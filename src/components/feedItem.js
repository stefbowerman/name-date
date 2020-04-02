import React from 'react'
import Link from 'gatsby-link'
import Img from 'gatsby-image'

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
    const project = this.props.project;
    const image = this.props.image;
    const orientation = image.fluid.aspectRatio < 1 ? 'portrait' : 'landscape';

    return (
      <div className={`feedItem feedItem--${orientation}`} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <Link to={`/project/${project.slug}`}>
          <Img
            fluid={image.fluid}
            alt={project.title}
            durationFadeIn={900}
          />
        </Link>
        
        {project.title != undefined &&
          <div
            className="feedItemTitle"
            style={ { opacity: (this.state.isHovering ? 1 : 0) } }
            dangerouslySetInnerHTML={{
              __html: project.title
            }}
          />
        }
      </div>
    )
  }
}

export default FeedItem