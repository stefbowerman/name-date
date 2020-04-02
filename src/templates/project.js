import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import Layout from '../components/layout'
import YoutubeEmbed from '../components/youtubeEmbed';
import ProjectImage from '../components/projectImage';
import { graphql } from 'gatsby'
import styles from './project.module.scss'

class ProjectTemplate extends React.Component {
  render() {
    const project = get(this.props, 'data.contentfulProject')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const hasVideo = project.youtubeID !== null && project.youtubeID.length > 0;

    return (
      <Layout location={this.props.location} >
        <Helmet title={`${project.title} | ${siteTitle}`} />
        <div className={styles.projectWrapper}>
          <div className={styles.projectContent}>
            {
              hasVideo ? (
                <div className={styles.projectVideoWrapper}>
                  <div className={styles.projectVideo}>
                    <YoutubeEmbed id={project.youtubeID} />
                  </div>
                </div>
              ) : project.images && (
                <div className={styles.projectImagesWrapper}>
                  <div className={styles.projectImages}>
                    {project.images.map((image, index) => {
                      return (
                        <ProjectImage image={image} key={ `project-img-${index}` } />
                      )
                    })}
                  </div>
                </div>
              )
            }

            <div className={styles.projectCopy} style={ {textAlign: (hasVideo ? 'center' : '')} }>
              <h1 className={styles.projectTitle}>{project.title}</h1>
              {
                // Only render if there is a description
                project.description && (              
                  <div dangerouslySetInnerHTML={{
                    __html: project.description.childMarkdownRemark.html,
                  }} />
                )
              }
            </div>         
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
      description {
        childMarkdownRemark {
          html
        }
      }
      images {
        fluid {
          aspectRatio
          src
          srcSet
          sizes
        }   
        placeholder: resize(width: 10) {
          src
          width
          height 
        }
      }
      youtubeID
    }
  }
`
