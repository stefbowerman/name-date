import React from 'react'
import Link from 'gatsby-link'
import styles from './backButton.module.scss'

class BackButton extends React.Component {
  render() {
    return (
      <Link to="/" className={styles.button} title="Back">Back</Link>
    )
  }
}

export default BackButton