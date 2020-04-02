import React from 'react'
import Link from 'gatsby-link'
import styles from './backButton.module.scss'

const BackButton = ({ show }) => {
  const cn = `${styles.button} ${show ? styles.show : ''}`;

  return (
    <Link to="/" className={cn} title="Back">Back</Link>
  )
}

export default BackButton