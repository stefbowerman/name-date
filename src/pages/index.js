import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import Feed from '../components/feed';
import FeedItem from '../components/feedItem';

class RootIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const feedItems = get(this, 'props.data.allContentfulFeed.edges')

    return (
      <Layout location={this.props.location} >
        <Helmet title={siteTitle} />
        <div className="wrapper">
          <Feed feedItems={feedItems} />
        </div>
      </Layout>
    )
  }
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
            resize(width: 1180) {
              src
              width
              height
            }
          }
          project {
            id
            title
            slug
            featuredImage {
              resize(width: 1180) {
                src
                width
                height
              }
            }
            caption {
              childMarkdownRemark {
                html
              }
            }
            description {
              childMarkdownRemark {
                html
              }
            }
            images {
              resize(width: 1180) {
                src
                width
                height
              }
            }
          }
        }
      }
    }       
  }
`
