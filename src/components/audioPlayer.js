import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import gsap from 'gsap'
import styles from './audioPlayer.module.scss'

const mapStateToProps = state => {
  const props = {
    userAudioEnabledPreference: state.userAudioEnabledPreference,
    shouldBePlaying: state.audioShouldBePlaying
  }

  return props
}

const mapDispatchToProps = dispatch => {
  return {
    setUserAudioEnabledPreference: data => dispatch({ type: 'SET_USER_AUDIO_ENABLED_PREFERENCE', payload: data })
  }
}

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.player = null;
    this.tweenableProps = {
      vol: 0
    }

    this.state = {
      playing: false,
      visuallyPlaying: false // actual playing state is slightly removed from the visual playing state because we fadeout the audio
    }

    this.fadeInTween = gsap.fromTo(this.tweenableProps, { vol: 0 }, {
      vol: 1,
      duration: 2,
      paused: true,
      onUpdate: () => {
        this.setAudioVolume(this.tweenableProps.vol)
      },
      onComplete: () => {
        this.onFadeInComplete()
      }
    });

    this.fadeOutTween  = gsap.fromTo(this.tweenableProps, { vol: 1 }, {
      vol: 0,
      duration: 0.5,
      paused: true,
      onUpdate: () => {
        this.setAudioVolume(this.tweenableProps.vol)
      },
      onComplete: () => {
        this.onFadeOutComplete()
      }
    });

    this.toggleAudio = this.toggleAudio.bind(this)
    this.setAudioVolume = this.setAudioVolume.bind(this)
    this.handlePlayerCanPlay = this.handlePlayerCanPlay.bind(this)
  }

  componentDidMount() {
    this.player.volume = 0

    this.player.addEventListener('play', () => {
      this.setState({
        playing: true,
        visuallyPlaying: true
      })
    })

    this.player.addEventListener('pause', () => {
      this.setState({
        playing: false,
        visuallyPlaying: false
      })
    })    
    
    if (this.props.shouldBePlaying && this.props.userAudioEnabledPreference) {
      this.player.addEventListener('canplay', () => {
        // console.log('audio can play');
        this.handlePlayerCanPlay();
      })
    }
  }

  componentWillUnmount() {
    this.player.removeEventListener('canplay', this.handlePlayerCanPlay)
  }

  componentDidUpdate(prevProps) {
    // console.log(this.props.shouldBePlaying)

    const userAudioEnabledCurrently = this.props.userAudioEnabledPreference

    // If the user had audio *enabled* and now it's 'disabled'
    if (prevProps.userAudioEnabledPreference && !userAudioEnabledCurrently) {
      // console.log('going from enabled to disabled')
      this.playOut()
    }
    // If the user had audio *disabled* and now it's 'enabled'
    else if (!prevProps.userAudioEnabledPreference && userAudioEnabledCurrently) {
      // console.log('going from disabled to enabled')
      this.props.shouldBePlaying && this.playIn();
    }

    // If the 'shouldBePlaying' prop is changed
    if (prevProps.shouldBePlaying !== this.props.shouldBePlaying) {
      (this.props.shouldBePlaying && userAudioEnabledCurrently) ? this.playIn() : this.playOut()
    }
  }

  handlePlayerCanPlay() {
    this.playIn()
  }

  onFadeOutComplete() {
    this.player.pause()
    this.fadeOutTween.pause()
  }

  onFadeInComplete() {
    this.fadeInTween.pause();
  }

  setAudioVolume(volume) {
    if (!this.player) return

    this.player.volume = volume
  }

  playIn() {
    if (!this.player || this.state.playing) return
    this.fadeOutTween.kill()

    const p = this.player.play()

    if (p !== undefined) {
      p.then(() => {
        this.fadeInTween.seek(0).play()
      }, (e) => {
        console.log(e)
      })
    }
  }

  playOut() {
    if (!this.player || !this.state.playing) return

    this.fadeInTween.kill()
    this.fadeOutTween.seek(0).play()
    this.setState({
      visuallyPlaying: false
    })
  }

  toggleAudio() {
    // playIn / Out has to get called explicitly to work with iOS
    if (this.state.playing) {
      this.props.setUserAudioEnabledPreference(false)
      this.playOut()
    }
    else {
      this.props.setUserAudioEnabledPreference(true)
      this.playIn()
    }
  }

  render() {
    const classNames = [styles.audioPlayer]
    
    this.props.shouldBePlaying && classNames.push(styles.show)

    return (
      <div className={ classNames.join(' ') }>
        <span onClick={this.toggleAudio} style={{ cursor: 'pointer' }}>
          {this.state.visuallyPlaying ? 'Pause' : 'Play'} audio
        </span>
        <audio
          ref={ el => this.player = el }
          preload="auto" 
          loop
        >
          <source
            src={ this.props.file }
            type={`audio/${this.props.file.includes('ogg') ? 'ogg' : 'mpeg'}`}
          />
        </audio>
      </div>
    )
  }
}

const ConnectedAudioPlayer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayer)

export default ConnectedAudioPlayer

AudioPlayer.proptypes = {
  file: PropTypes.string,
  shouldBePlaying: PropTypes.bool
}
