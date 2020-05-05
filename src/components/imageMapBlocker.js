import React from 'react'
import PropTypes from 'prop-types'
import gsap from 'gsap'

class ImageMapBlocker extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      progress: 0
    }

    this.tweenProgress = 0
  }

  componentDidUpdate(prevProps) {
    if (prevProps.progress === this.props.progress) {
      return
    }

    this.setProgress()
  }

  setProgress() {
    gsap.to(this, {
      tweenProgress: Math.ceil(this.props.progress),
      duration: 0.3,
      onUpdate: () => {
        this.setState({
          progress: this.tweenProgress
        })
      },
      onComplete: this.onProgressTweenComplete.bind(this)
    })
  }

  onProgressTweenComplete() {
    if (this.tweenProgress === 100) {
      this.setState({
        progress: 100
      })      
    }
  }

  render() {
    const klasses = ['image-map-blocker']

    if(this.state.progress === 100) {
      klasses.push('is-loaded')
    }

    return (
      <div className={klasses.join(' ')}>
        <div className="image-map-blocker__loader">
          loading
          <span className="image-map__progress-bar" style={{ width: `${this.state.progress}%`}}></span>
        </div>
      </div>
    )
  }
}

export default ImageMapBlocker

ImageMapBlocker.proptypes = {
  progress: PropTypes.number
}