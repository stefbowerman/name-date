import React from 'react'
import { useLocation } from "@reach/router"
import { navigate } from "gatsby"

import styles from './backButton.module.scss'

const BackButton = ({ show }) => {
  const location = useLocation()
  const cn = `${styles.button} ${show ? styles.show : ''}`;

  const handleClick = () => {
    const { pathname } = location

    let to = '/'

    if (pathname.includes('/project')) {
      to = '/work'
    }

    navigate(to)
  }

  return (
    <span className={cn} onClick={handleClick}>Back</span>
  )
}

export default BackButton