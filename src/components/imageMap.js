import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// import { Application, Graphics, Sprite } from 'isomorphic-pixi'
import { Application, Sprite } from 'isomorphic-pixi'
import { throttle } from 'underscore'

// Desktop Variables
let boxHeight = 2710 // 2704
let boxWidth = 3750
let worldBoxCountColumns = 8
let worldBoxCountRows = 6
let worldWidth = worldBoxCountColumns * boxWidth
let worldHeight = worldBoxCountRows * boxHeight
let totalBoxCount = worldBoxCountColumns * worldBoxCountRows
let totalBoxCountArray = Array(totalBoxCount).fill()
let boxBuffer = 200 // number of pixels to buffer around the box when checking for intersection
let zoomMinScale = 0.3
let zoomMaxScale = 0.87
let blankTileIndexes = [] // Array of 1based indexes where the tile is blank (we can skip loading)

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
      // boxHeight = 1405
      // boxWidth = 2000
      // worldBoxCountColumns = 8
      // worldBoxCountRows = 6
      // worldWidth = worldBoxCountColumns * boxWidth
      // worldHeight = worldBoxCountRows * boxHeight
      // totalBoxCount = worldBoxCountColumns * worldBoxCountRows
      // totalBoxCountArray = Array(totalBoxCount).fill()
      // boxBuffer = 200 // number of pixels to buffer around the box when checking for intersection      
      zoomMinScale = 0.4
      zoomMaxScale = 1
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
    // const PixiFps = require('pixi-fps').default

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
      .drag({
        clampWheel: true
      })
      .pinch()
      .wheel({
        smooth: 3
      })
      .decelerate({
        friction: 0.8
      })
      .clamp({
        direction: 'all'
      })
      .clampZoom({
        minScale: zoomMinScale,
        maxScale: zoomMaxScale
      })

    this.viewport
      .on('drag-start', this.handleViewportDragStart)
      .on('drag-end', this.handleViewportDragEnd)
      .on('moved', this.handleMoved)

    const center = {
      x: (this.viewport.worldWidth/2 - window.innerWidth/2),
      y: (this.viewport.worldHeight/2 - window.innerHeight/2)
    }

    // Set initial vars
    this.viewport.moveCenter(center.x, center.y);
    this.viewport.setZoom(zoomMinScale, true);

    // Add any assets to the loader
    let resourcesToLoad = []
    totalBoxCountArray.forEach((_, i) => {
      const { name, filePath } = this.tileInfoForIndex(i)

      // if they aren't already cached in there
      // Or if the tile is blank
      if (this.loader.resources[name] == undefined && !blankTileIndexes.includes(i+1)) {
        resourcesToLoad.push(name)
        this.loader.add(name, filePath)
      }
    })

    if (resourcesToLoad.length) {
      this.loader
        .on('progress', (loader, resource) => {
          // console.log(resource)
          // console.log(`loading: ${resource.url}`)
          // console.log(`progress: ${loader.progress}%`)
          this.props.onImageLoadProgress(loader.progress)
        })
        .load(this.onLoaderComplete.bind(this));
    }
    else {
      this.onLoaderComplete()
    }

    // Add FPS
    // const fpsCounter = new PixiFps();
    // this.app.stage.addChild(fpsCounter);    
  }

  onLoaderComplete() {
    this.tiles = totalBoxCountArray.map((_, i) => {
      return this.createAndPlaceMapTile(i)
    });

    this.onImageMapReady();
  }

  onImageMapReady() {
    this.handleResize()

    setTimeout(this.props.onImageMapReady, 200) // Give it a sec (or 0.2) for the image map to settle down
  }

  tileInfoForIndex(i) {
    let index = i+1
    index = index < 10 ? `0${index}` : index;      
    
    const name = `tile${i}`
    // const filePath = `/image_map/${window.innerWidth < 800 ? 'mobile' : 'desktop'}/tile_${index}.jpg`
    const filePath = `/image_map/v2/desktop/tile_${index}.jpg`

    return { name, filePath }
  }

  createAndPlaceMapTile(index) {
    const { name } = this.tileInfoForIndex(index)
    const resource = this.loader.resources[name] || { texture: undefined }
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
        sprite.visible = true
      }
      else {
        sprite.visible = false
      }
    })
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
    // console.log(this.viewport.scaled)
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