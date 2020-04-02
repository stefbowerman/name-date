import React from 'react'
import FeedItem from './feedItem.js'

const Feed = ({ feedItems }) => {
  return (
    <div className="feed">
      {feedItems && feedItems.map((data) => (
        <FeedItem
            image={data.node.image}
            project={data.node.project}
            key={data.node.id} 
          />
        ))
      }
    </div>
  )
}

export default Feed