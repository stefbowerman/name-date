import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import Feed from '../components/feed';
import FeedItem from '../components/feedItem';

const RootIndex = ({ data, location }) => {
  return (
    <React.Fragment>
      <Helmet title={data.site.siteMetadata.title} />
      <div className="wrapper">
        <Feed feedItems={data.allContentfulFeed.edges} />
      </div>
    </React.Fragment>
  )
}

export default RootIndex

export const pageQuery = graphql`
  query HomeQuery {
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
