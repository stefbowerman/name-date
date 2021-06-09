import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Feed from '../components/feed';

const WorkPage = ({ data }) => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{`Work | ${data.site.siteMetadata.title}`}</title>
        <meta property="og:title" content={`Work | ${data.site.siteMetadata.title}`}></meta>
      </Helmet>

      <div className="wrapper">
        <Feed feedItems={data.allContentfulFeed.edges} />
      </div>
    </React.Fragment>
  )
}

export default WorkPage

export const pageQuery = graphql`
  query NameQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulFeed {
      edges {
        node {
          id
          image {
            fluid {
              aspectRatio
              src
              srcSet
              sizes
            }
          }
          project {
            id
            title
            slug
          }
        }
      }
    }       
  }
`
