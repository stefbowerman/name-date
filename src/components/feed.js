import React from 'react'
import FeedItem from './feedItem.js'

class Feed extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="feed">
        {this.props.feedItems && this.props.feedItems.map((data) => {
          return (
            <FeedItem image={data.node.image} project={data.node.project} key={data.node.id} />
          )
        })}
      </div>
    )
  }
}

export default Feed