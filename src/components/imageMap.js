import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Application, Graphics, Sprite } from 'isomorphic-pixi'
import { throttle } from 'underscore'

// Desktop Variables
let boxHeight = 2675
let boxWidth = 2500
let worldBoxCountColumns = 8
let worldBoxCountRows = 4
let worldWidth = worldBoxCountColumns * boxWidth
let worldHeight = worldBoxCountRows * boxHeight
let totalBoxCount = worldBoxCountColumns * worldBoxCountRows
let totalBoxCountArray = Array(totalBoxCount).fill()
let boxBuffer = 200 // number of pixels to buffer around the box when checking for intersection
let zoomMaxWidth  = boxWidth * 1.5
let zoomMaxheight = boxHeight * 1
let zoomMinHeight = boxHeight / 6
let zoomMinWidth  = boxWidth / 6

// @TODO - Inside componentWillUnmount -> set center coordinated + zoom into redux state and use incase some one comes back to the page?

const mapStateToProps = state => {
  return {
    pixiLoader: state.pixiLoader
  }
}

class ImageMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDragging: false
    }

    this.app = null
    this.loader = null
    this.tiles = []
    this.elRef = React.createRef()

    this.handleResize = this.handleResize.bind(this)
    this.handleViewportDragStart = this.handleViewportDragStart.bind(this)
    this.handleViewportDragEnd = this.handleViewportDragEnd.bind(this)
    this.handleMoved = throttle(this.handleMoved.bind(this), 100)
  }

  componentDidMount() {
    // If we're on a mobile device, update the variables for the mobile map
    if (window.innerWidth < 800) {
      boxHeight = 1784
      boxWidth = 2000
      worldBoxCountColumns = 10
      worldBoxCountRows = 6
      worldWidth = worldBoxCountColumns * boxWidth
      worldHeight = worldBoxCountRows * boxHeight
      totalBoxCount = worldBoxCountColumns * worldBoxCountRows
      totalBoxCountArray = Array(totalBoxCount).fill()
      boxBuffer = 100
      zoomMaxWidth  = boxWidth * 2
      zoomMaxheight = boxHeight * 2
      zoomMinHeight = boxHeight / 6
      zoomMinWidth  = boxWidth / 6
    }

    if (this.props.pixiLoader) {
      this.createPixiApp()
    }

    document.body.style.overflow = 'hidden'    
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pixiLoader && !prevProps.pixiLoader) {
      this.createPixiApp()
    }
  }

  componentWillUnmount() {
    this.app && this.app.destroy()
    this.viewport && this.viewport.destroy()
    this.handleMoved.cancel()
    document.body.style.overflow = ''
    window.removeEventListener('resize', this.handleResize)
  }  

  createPixiApp() {
    if (this.app !== null) return;

    // Can't import this outside of this func, relies on the window
    const Viewport = require('pixi-viewport').Viewport;
    const PixiFps = require('pixi-fps').default

    this.loader = this.props.pixiLoader

    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio,
      resizeTo: window,
      backgroundColor: 0xFFFFFF
    });

    this.elRef.current.appendChild(this.app.view)

    this.initialRatio = window.innerWidth/window.innerHeight

    this.app.view.style.position = 'fixed'
    this.app.view.style.zIndex = 0
    this.app.view.style.top = 0
    this.app.view.style.left = 0
    this.app.view.style.width = '100%'
    this.app.view.style.height = '100%'

    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth,
      worldHeight,
      passiveWheel: false,
      stoppropagation: true,
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
        maxWidth: zoomMaxWidth,
        maxheight: zoomMaxheight,
        minHeight: zoomMinHeight,
        minWidth: zoomMinWidth,
      })

    this.viewport
      .on('drag-start', this.handleViewportDragStart)
      .on('drag-end', this.handleViewportDragEnd)
      .on('moved', this.handleMoved)

    // Add any assets to the loader if they aren't already cached in there
    totalBoxCountArray.forEach((_, i) => {
      const { name, filePath } = this.tileInfoForIndex(i)

      if (this.loader.resources[name] == undefined) {
        this.loader.add(name, filePath)
      }
    })

    this.loader
      .on('progress', (loader, resource) => {
        // console.log(resource)
        // console.log(`loading: ${resource.url}`)
        // console.log(`progress: ${loader.progress}%`)
        this.props.onImageLoadProgress(loader.progress)
      })
      .load(this.onLoaderComplete.bind(this));

    const center = {
      x: (this.viewport.worldWidth/2 - window.innerWidth/2),
      y: (this.viewport.worldHeight/2 - window.innerHeight/2)
    }

    // Set initial vars
    this.viewport.moveCenter(center.x - 100, center.y - 100);
    this.viewport.setZoom((window.innerWidth < 800 ? 0.4 : 0.75), true);

    // Add FPS
    // const fpsCounter = new PixiFps();
    // this.app.stage.addChild(fpsCounter);
  }

  onLoaderComplete() {
    this.tiles = totalBoxCountArray.map((_, i) => {
      const { name } = this.tileInfoForIndex(i)

      return this.createAndPlaceMapTile(this.loader.resources[name], i)
    });

    this.onImageMapReady();
  }

  onImageMapReady() {
    this.setTileVisibility();

    setTimeout(this.props.onImageMapReady, 200) // Give it a sec (or 0.2) for the image map to settle down
  }

  tileInfoForIndex(i) {
    let index = i+1
    index = index < 10 ? `0${index}` : index;      
    
    const name = `tile${i}`
    const filePath = window.innerWidth < 800 ? `/image_map/mobile/image-map-${index}.jpg` : `/image_map/image-map_${index}.jpg`

    return { name, filePath }
  }

  createAndPlaceMapTile(resource, index) {   
    const sprite = new Sprite(resource.texture);

    // Figure out the position
    const rowIndex = Math.floor(index/worldBoxCountColumns)
    const columnIndex = index % worldBoxCountColumns
    const x = columnIndex * boxWidth
    const y = rowIndex * boxHeight

    sprite.position.set(x, y)
    sprite.height = boxHeight
    sprite.width = boxWidth
    sprite.visible = false

    this.viewport.addChild(sprite)

    // const line = this.viewport.addChild(new Graphics());

    // let x2 = x - boxBuffer
    // let y2 = y - boxBuffer
    // let height2 = boxHeight + boxBuffer*2
    // let width2 = boxWidth + boxBuffer*2    
    // line.lineStyle(1, 0x6ca769).drawRect(x2, y2, width2, height2);

    return { sprite, x, y }
  }

  setTileVisibility() {
    if (!this.app) return

    const viewportRectangle = this.viewport.getVisibleBounds()

    let visibleCount = 0
    this.tiles.forEach((tile, j) => {
      let { sprite, x, y } = tile
      let { height, width } = sprite

      // Adjust the bounding rectangle based on the buffer we set as a constant
      x -= boxBuffer
      y -= boxBuffer
      height += boxBuffer*2
      width  += boxBuffer*2

      const tileRectangle = {x, y, width, height, top: y, bottom: (y+height), left: x, right: (x+width) }

      if (this.checkRectangleIntersection(tileRectangle, viewportRectangle)) {
        // console.log(`${}`)
        // sprite.tint = 0xFF0000
        sprite.visible = true
        visibleCount++
      }
      else {
        sprite.tint = 0xFFFFFF
        sprite.visible = false
      }
    })

    console.log(`visible count = ${visibleCount}`)
  }

  checkRectangleIntersection(r1, r2) {
    return !(r2.left > r1.right || r2.right < r1.left ||  r2.top > r1.bottom || r2.bottom < r1.top);
  }

  handleResize() {
    this.app && this.app.resize(); // knows to resize to the window via the resizeTo param
    this.viewport && this.viewport.resize(window.innerWidth, window.innerHeight, worldWidth, worldHeight)
    this.setTileVisibility()
  }

  handleViewportDragStart() {
    this.setState({
      isDragging: true
    })
  }

  handleViewportDragEnd() {
    this.setState({
      isDragging: false
    })
  }

  handleMoved() {
    this.setTileVisibility()
  }

  render() {
    return (
      <div
        ref={this.elRef}
        className="image-map"
        style={{
          cursor: (this.state.isDragging ? 'grabbing' : 'grab' )
        }}
      />
    )
  }
}

const ConnectedImageMap = connect(
  mapStateToProps
)(ImageMap)

export default ConnectedImageMap

ImageMap.proptypes = {
  onImageLoadProgress: PropTypes.func,
  onImageMapReady: PropTypes.func
}

ImageMap.defaultProps = {
  onImageLoadProgress: () => {},
  onImageMapReady: () => {}
}