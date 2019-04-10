import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import Layout from '../components/layout'

class ProjectTemplate extends React.Component {
  render() {
    const project = get(this.props, 'data.contentfulProject')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <Layout location={this.props.location} >
        <div style={{ background: '#fff' }}>
          <Helmet title={`${project.title} | ${siteTitle}`} />
          <div className="wrapper">
            <h1 className="section-headline">{project.title}</h1>
            <img src={project.featuredImage.resize.src} />
          </div>
        </div>
      </Layout>
    )
  }
}

export default ProjectTemplate

export const pageQuery = graphql`
  query ProjectBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulProject(slug: { eq: $slug }) {
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
`
