import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import ImageMapBlocker from '../components/imageMapBlocker'
import ImageMap from '../components/imageMap'

const RootIndex = ({ data }) => {
  const dispatch = useDispatch()
  const [progress, setProgress] = useState(0)

  const handleProgress = p => setProgress(p)

  useEffect(() => {
    return () => {
      dispatch({ type: 'SET_AUDIO_SHOULD_BE_PLAYING', payload: false })
    }
  }, [])

  useEffect(() => {
    let tO = null

    if (progress === 100) {
      tO = setTimeout(() => {
        dispatch({ type: 'SET_AUDIO_SHOULD_BE_PLAYING', payload: true })
      }, 1500)
    }

    return () => {
      clearTimeout(tO)
    }
  }, [progress])

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Date | ${data.site.siteMetadata.title}`}</title>
        <meta property="og:title" content={`Date | ${data.site.siteMetadata.title}`}></meta>
      </Helmet>
      
      <ImageMapBlocker
        progress={progress}
      />
      <ImageMap
        onImageLoadProgress={progress => handleProgress(progress)}
        onImageMapReady={() => handleProgress(100)}
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
        description
      }
    }
  }
`
