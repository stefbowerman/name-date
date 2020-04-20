import React from 'react'
import PropTypes from 'prop-types'
import { Application, Loader, Graphics, Sprite } from 'isomorphic-pixi'

// const worldWidth = 16 * 1000
// const worldHeight = 96 * 100

const boxHeight = 4800
const boxWidth = 4000
const worldBoxCountColumns = 4
const worldBoxCountRows = 2
const worldWidth = worldBoxCountColumns * boxWidth
const worldHeight = worldBoxCountRows * boxHeight
const totalBoxCount = worldBoxCountColumns * worldBoxCountRows

class ImageMapTest extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDragging: false
    }

    this.elRef = React.createRef();
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    const Viewport = require('pixi-viewport').Viewport; // Can't import this outside of this func, relies on the window
    const PixiFps = require('pixi-fps').default

    this.app = new Application({ transparent: true, width: window.innerWidth, height: window.innerHeight, resolution: window.devicePixelRatio })
    this.elRef.current.appendChild(this.app.view)

    this.app.view.style.position = 'fixed'
    this.app.view.style.width = '100vw'
    this.app.view.style.height = '100vh'
    this.app.view.style.top = 0
    this.app.view.style.left = 0
    this.app.view.style.zIndex = 0

    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth,
      worldHeight,
      interaction: this.app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    })

    // add the viewport to the stage
    this.app.stage.addChild(this.viewport)

    // activate plugins
    this.viewport
      .drag({ clampWheel: true })
      .pinch()
      .wheel({ smooth: 3 })
      .decelerate({
        friction: 0.8
      })
      .clamp({
        direction: 'all'
      })
      .clampZoom({
        // maxWidth: window.innerWidth,
        // maxheight: window.innerHeight
        minHeight: window.innerHeight,
        minWidth: window.innerWidth
      })

    this.viewport.on('drag-start', () => {
        if (this.state.isDragging) return

        this.setState({
          isDragging: true
        })
      })
      .on('drag-end', () => {
        this.setState({
          isDragging: false
        })
      })

    const loader = new Loader()
    const totalBoxCountArray = Array(totalBoxCount).fill()

    totalBoxCountArray.forEach((_, i) => {
      loader.add(`tile${i}`, `full-map-${i}.jpg`)
    });

    loader
      .on('progress', (loader, resource) => {
        // console.log(resource)
        // console.log(`loading: ${resource.url}`)
        // console.log(`progress: ${loader.progress}%`)
        this.props.onImageLoadProgress(loader.progress)
      })
      .load((loader, resources) => {
        totalBoxCountArray.forEach((_, i) => {
          this.createAndPlaceMapTile(resources[`tile${i}`])
        });
        
        this.props.onImagesLoaded();
      });

    // Add a green border
    // const line = this.viewport.addChild(new Graphics());
    // line.lineStyle(3, 0x6ca769).drawRect(0, 0, this.viewport.worldWidth, this.viewport.worldHeight);

    const center = {
      x: (this.viewport.worldWidth/2 - window.innerWidth/2),
      y: (this.viewport.worldHeight/2 - window.innerHeight/2)
    }

    // Set initial vars
    this.viewport.moveCenter(center.x - 100, center.y - 100);
    this.viewport.setZoom(0.5, true);   

    window.addEventListener('resize', this.handleResize);
    document.body.style.overflow = 'hidden'

    // Add FPS
    // const fpsCounter = new PixiFps();
    // this.app.stage.addChild(fpsCounter);
  }

  createAndPlaceMapTile(resource) {
    const index = Number.parseInt(resource.name.replace('tile', ''))
    
    // Create the texture
    const sprite = new Sprite(resource.texture);

    // Figure out the position
    const rowIndex = Math.floor(index/worldBoxCountColumns)
    const columnIndex = index % worldBoxCountColumns
    let x = columnIndex * boxWidth
    let y = rowIndex * boxHeight

    sprite.position.set(x, y)
    sprite.height = boxHeight
    sprite.width = boxWidth

    this.viewport.addChild(sprite)

    console.log(`visible? ${sprite.visible}`)
    console.log(`settings sprite to (${x}, ${y})`)
    sprite.visible = true
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    document.body.style.overflow = ''
    this.app && this.app.destroy()
    this.viewport && this.viewport.destroy()
  }

  handleResize() {
    // this.app && this.app.resize(window.inerWidth, window.innerHeight)
    // this.viewport && this.viewport.resize(window.innerWidth, window.innerHeight, worldWidth, worldHeight)
  }

  render() {
    return (
      <div ref={this.elRef} className="image-map" style={ {cursor: (this.state.isDragging ? 'grabbing' : 'grab' )} }/>
    )
  }
}

export default ImageMapTest

ImageMapTest.proptypes = {
  onImageLoadProgress: PropTypes.func,
  onImagesLoaded: PropTypes.func
}

ImageMapTest.defaultProps = {
  onImageLoadProgress: () => {},
  onImagesLoaded: () => {}
}