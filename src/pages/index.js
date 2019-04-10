import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import ProjectSummary from '../components/projectSummary'

class RootIndex extends React.Component {
  componentDidMount() {
    console.log('mounted!')
    console.log(this)
  }
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const projects = get(this, 'props.data.allContentfulProject.edges')

    return (
      <Layout location={this.props.location} >
        <Helmet title={siteTitle} />
        <div className="wrapper">
          {projects.map(({ node }) => {
            return (
              <ProjectSummary project={node} key={node.slug} />
            )
          })}
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
    allContentfulPerson(filter: { contentful_id: { eq: "15jwOBqpxqSAOy2eOO4S0m" } }) {
      edges {
        node {
          name
          shortBio {
            shortBio
          }
          title
          heroImage: image {
            fluid(
              maxWidth: 1180
              maxHeight: 480
              resizingBehavior: PAD
              background: "rgb:000000"
            ) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
        }
      }
    }
    allContentfulProject {
      edges {
        node {
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
        }
      }
    }    
  }
`
