import React from 'react'
import { Link } from 'gatsby'
import styles from './navigation.module.scss'

export default () => (
  <nav role="navigation">
    <ul className={styles.navigation}>
      <li className={styles.navigationItem}>
        <Link to="/">Work</Link>
      </li>
      <li className={styles.navigationItem}>
        <Link to="/about/">About</Link>
      </li>
    </ul>
  </nav>
)
