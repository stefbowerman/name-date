import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

const AboutPage = ({ data }) => {
  return (
    <React.Fragment>
      <Helmet title={ `404 | ${data.site.siteMetadata.title}` } />
      <div className="wrapper">
        404 Not Found
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