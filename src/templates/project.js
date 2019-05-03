import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import Layout from '../components/layout'
import { graphql } from 'gatsby'
import styles from './project.module.scss'

class ProjectTemplate extends React.Component {
  render() {
    const project = get(this.props, 'data.contentfulProject')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <Layout location={this.props.location} >
        <Helmet title={`${project.title} | ${siteTitle}`} />
        <div className="wrapper">
          <h1 className="section-headline">{project.title}</h1>
          <div dangerouslySetInnerHTML={{
            __html: project.description.childMarkdownRemark.html,
          }} />
          <div className={styles.projectImages}>
            {project.images.map((image, index) => {
              const key = `project-img-${index}`;

              return (
                <div className={styles.projectImage} key={key}>
                  <img src={image.resize.src} />
                </div>
              )
            })}
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
`
