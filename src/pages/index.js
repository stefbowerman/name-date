import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import ImageMap from '../components/imageMap'

const RootIndex = ({ data }) => {
  const dispatch = useDispatch()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      dispatch({ type: 'SET_AUDIO_SHOULD_BE_PLAYING', payload: false })
    }
  }, [])

  const klasses = ['image-map-blocker']

  if(mapLoaded) {
    klasses.push('is-loaded')
  }

  return (
    <React.Fragment>
      <Helmet title={`Date | ${data.site.siteMetadata.title}`} />
      <div className={klasses.join(' ')}>
        <div className="image-map-blocker__loader">
          loading
          <span className="image-map__progress-bar" style={{ width: `${progress}%`}}></span>
        </div>
      </div>
      <ImageMap
        onImageLoadProgress={progress => {
          setProgress(progress)
        }}
        onImageMapReady={() => {
          setMapLoaded(true)
          setTimeout(() => {
            dispatch({ type: 'SET_AUDIO_SHOULD_BE_PLAYING', payload: true })
          }, 1500)
        }} 
      />
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
  }
`
