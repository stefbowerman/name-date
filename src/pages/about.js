import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import styles from './about.module.scss'

const NotFoundPage = ({ data, location }) => {
  return (
    <React.Fragment>
      <Helmet title={ `About | ${data.site.siteMetadata.title}` } />
      <div className="wrapper">
        <div className={styles.aboutWrapper}>
          <div className={styles.aboutWidth}>
            <div className={styles.aboutContent}>
              <div className={styles.aboutText}>
                <p>From Los Angeles.&nbsp;</p>
                <p>Creative.  Photo.  Film.</p>
                <div className={styles.contact}>
                  <a href="mailto:steventraylor96@gmail.com" target="_blank">Contact</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query NotFoundQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`