import React, { useState, useEffect, useRef } from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import YoutubeEmbed from '../components/youtubeEmbed';
import ProjectImage from '../components/projectImage';
import { getScrollY } from '../helpers';

import styles from './project.module.scss'

// @TODO - useEffect hooks don't apply to video projects so we have to do "if (!imagesScroller.current) return" which feels dirty...

const ProjectTemplate = ({ data }) => {
  const imagesScroller = useRef(null)

  const [scrollerHeight, setScrollerHeight] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [imageLoadedCount, setImageLoadedcount] = useState(0)
  const [windowSize, setWindowSize] = useState(0)

  const project = get(data, 'contentfulProject')
  const siteTitle = get(data, 'site.siteMetadata.title')
  const title = `${project.title} | ${siteTitle}`
  const featuredImage = get(project, 'featuredImage')
  const fallbackFeaturedImage = project.images && project.images[0]
  const ogImage = featuredImage || fallbackFeaturedImage
  const hasVideo = project.youtubeID !== null && project.youtubeID.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = getScrollY()
      let p = scrollY / (document.body.scrollHeight - window.innerHeight)
          p = parseFloat(p.toFixed(5)) 

      setScrollProgress(p)
    };

    const handleResize = () => {
      setWindowSize(window.innerWidth * window.innerHeight)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const y = Math.floor((document.body.scrollHeight - window.innerHeight) * scrollProgress)

    requestAnimationFrame(() => {
      window.scrollTo(0, y)
    })
  }, [windowSize, scrollerHeight])

  useEffect(() => {
    if (!imagesScroller.current) return

    setScrollerHeight(imagesScroller.current.scrollWidth - imagesScroller.current.clientWidth)
  }, [imageLoadedCount])

  useEffect(() => {
    if (!imagesScroller.current) return

    const scrollableDistance = imagesScroller.current.scrollWidth - imagesScroller.current.clientWidth
    const scrollLeft = Math.floor(scrollableDistance * scrollProgress)

    requestAnimationFrame(() => {
      imagesScroller.current.scrollLeft = scrollLeft
    })
  }, [scrollProgress])


  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
      </Helmet>

      {
        project.description && (  
          <Helmet>
            <meta
              property="og:description"
              content={project.description.childMarkdownRemark.html.replace(/(<([^>]+)>)/gi, "")}
            />
          </Helmet>
        )
      }      

      { ogImage && (
        <Helmet>
          <meta property="og:image" content={ogImage.fixed.src} />
          <meta property="og:image:width" content={ogImage.fixed.width} />
          <meta property="og:image:height" content={ogImage.fixed.height} />
        </Helmet>
        )
      }

      <div
        className={styles.scroller}
        style={{ height: scrollerHeight }}
      />
      
      <div className={styles.projectWrapper}>
        <div className={styles.projectContent}>
          {
            hasVideo ? (
              <div className={styles.projectVideoWrapper}>
                <div className={styles.projectVideo}>
                  <YoutubeEmbed
                    id={project.youtubeID}
                  />
                </div>
              </div>
            ) : project.images && (
              <div className={styles.projectImagesWrapper}>
                <div className={styles.projectImages} ref={imagesScroller}>
                  {project.images.map((image, index) => (
                      <ProjectImage
                        image={image}
                        key={`project-img-${index}`}
                        onLoad={() => setImageLoadedcount(imageLoadedCount + 1)}
                      />
                    )
                  )}
                </div>
              </div>
            )
          }

          <div className={styles.projectCopy} style={{ textAlign: (hasVideo ? 'center' : '') }}>
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
    </React.Fragment>
  )
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
      featuredImage {
        fluid {
          aspectRatio
          src
          srcSet
          sizes
        }
        fixed: resize(width: 500) {
          src
          width
          height
        }
      }
      images {
        fluid {
          aspectRatio
          src
          srcSet
          sizes
        }
        fixed: resize(width: 500) {
          src
          width
          height
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
