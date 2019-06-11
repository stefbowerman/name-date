import React from 'react'
import { graphql } from 'gatsby'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from "../components/layout"
import BackButton from '../components/backButton';
import styles from './about.module.scss';

class AboutPage extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')

    return (
      <Layout location={this.props.location} >
        <Helmet title={ `About | ${siteTitle}` } />
        <BackButton />
        <div className="wrapper">
          <div className={styles.aboutWrapper}>
            <div className={styles.aboutWidth}>
              <div className={styles.aboutContent}>
                <div className={styles.aboutText}>
                  <p>From Los Angeles Creative.  Photo.  Film.</p>
                  <div className={styles.contact}>
                    <a href="mailto:steventraylor96@gmail.com" target="_blank">Contact</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
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