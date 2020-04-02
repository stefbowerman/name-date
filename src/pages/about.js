import React from 'react'
import { graphql } from 'gatsby'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from "../components/layout"
import styles from './about.module.scss'

const AboutPage = ({ data, location }) => {
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

export default AboutPage

export const pageQuery = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`