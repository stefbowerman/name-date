import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Feed from '../components/feed';

const RootIndex = ({ data, location }) => {
  return (
    <React.Fragment>
      <Helmet title={`Work | ${data.site.siteMetadata.title}`} />
      <div className="wrapper">
        <Feed feedItems={data.allContentfulFeed.edges} />
      </div>
    </React.Fragment>
  )
}

export default RootIndex

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
