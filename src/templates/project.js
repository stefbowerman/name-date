import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import Layout from '../components/layout'
import BackButton from '../components/backButton';
import YoutubeEmbed from '../components/youtubeEmbed';
import { graphql } from 'gatsby'
import styles from './project.module.scss'

class ProjectTemplate extends React.Component {
  constructor(props) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }
  onClick(e) {
    console.log(e);
    console.log('not working??');
  }  
  render() {
    const project = get(this.props, 'data.contentfulProject')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const hasVideo = project.youtubeID !== null && project.youtubeID.length > 0;

    return (
      <Layout location={this.props.location} >
        <Helmet title={`${project.title} | ${siteTitle}`} />
        <BackButton />
        <div className={styles.projectWrapper}>
          <div className={styles.projectContent}>
            {
              hasVideo ? (
                <div className={styles.projectVideoWrapper}>
                  <div className={styles.projectVideo}>
                    <YoutubeEmbed id={project.youtubeID} />
                  </div>
                </div>
              ) : (
                <div className={styles.projectImagesWrapper}>
                  <div className={styles.projectImages} onClick={(e) => { this.onClick(e); }}>
                    {project.images.map((image, index) => {
                      return (
                        <div className={styles.projectImage} key={ `project-img-${index}` }>
                          <img src={image.resize.src} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            }

            <div className={styles.projectCopy} style={ {textAlign: (hasVideo ? 'center' : '')} }>
              <h1 className={styles.projectTitle} >{project.title}</h1>
              <div dangerouslySetInnerHTML={{
                __html: project.description.childMarkdownRemark.html,
              }} />
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
        resize(width: 1600) {
          src
          width
          height
        }
      }
      youtubeID
    }
  }
`
