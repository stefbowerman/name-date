import React from 'react'
import styles from './feed.module.scss'
import FeedItem from './feedItem.js'

class Feed extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className={styles.feed}>
        {this.props.feedItems.map((data) => {
          return (
            <div className={styles.feedEntry} key={data.node.id}>
              <FeedItem image={data.node.image} project={data.node.project} />
            </div>
          )
        })}
      </div>
    )
  }
}

export default Feed