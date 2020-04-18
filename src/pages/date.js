import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import ImageMapTest from '../components/imageMapTest'

const DatePage = ({ data }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  const klasses = ['image-map-blocker']

  if(imagesLoaded) {
    klasses.push('is-loaded')
  }

  return (
    <React.Fragment>
      <Helmet title={data.site.siteMetadata.title} />
      <div className={klasses.join(' ')}>
        Loading...<br />
        Progress = {`${progress}%`}
      </div>
      <ImageMapTest
        onImageLoadProgress={(progress) => {
          setProgress(progress)
        }}
        onImagesLoaded={() => {
          setTimeout(() => {
            setImagesLoaded(true)
          }, 2000)
        }} 
      />
    </React.Fragment>
  )
}

export default DatePage

export const pageQuery = graphql`
  query DatePageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`