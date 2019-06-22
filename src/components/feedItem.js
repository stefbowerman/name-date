import React from 'react'
import Link from 'gatsby-link'

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
    const orientation = (this.props.image.resize.height > this.props.image.resize.width ? 'portrait' : 'landscape');
    const ratio = (this.props.image.resize.height * 100 / this.props.image.resize.width).toFixed(2);
    let className = `feedItem feedItem--${orientation}`;

    return (
      <div className={className} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <Link to={`/project/${project.slug}`}>
          <div style={ {position: 'relative', height: 0, paddingBottom: `${ratio}%` } }>
            <img src={image.resize.src} alt={project.title} style={ {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0} }/>
          </div>
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