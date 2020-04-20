import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import ImageMapTest from '../components/imageMapTest'

const DatePage = ({ data }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const klasses = ['image-map-blocker']

  if(imagesLoaded) {
    klasses.push('is-loaded')
  }

  return (
    <React.Fragment>
      <Helmet title={data.site.siteMetadata.title} />
      <div className={klasses.join(' ')}>
        <div className="image-map-blocker__loader">
          loading...
        </div>
      </div>
      <ImageMapTest
        onImagesLoaded={() => {
          setTimeout(() => {
            setImagesLoaded(true)
          }, 1000)
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