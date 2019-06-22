import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import styles from './youtubeEmbed.module.scss'

class YoutubeEmbed extends React.Component {
  render() {

    return (
      <div className={styles.container}>
        <iframe src={ `https://www.youtube.com/embed/${this.props.id}` } frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
    )
  }
}

export default YoutubeEmbed
