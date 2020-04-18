import React from 'react'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'

const boxSize = 600
const worldBoxCountColumns = 10
const worldBoxCountRows = 6
const worldWidth = worldBoxCountColumns * boxSize
const worldHeight = worldBoxCountRows * boxSize

class ImageMap extends React.Component {
  constructor(props) {
    super(props)
    this.elRef = React.createRef();
    this.isMoving = false
    this.boxes = []

    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    this.app = new PIXI.Application({ transparent: true, width: window.innerWidth, height: window.innerHeight, resolution: window.devicePixelRatio })
    console.log(this.elRef)
    console.log(this.app)
    this.elRef.current.appendChild(this.app.view)

    this.app.view.style.position = 'fixed'
    this.app.view.style.width = '100vw'
    this.app.view.style.height = '100vh'
    this.app.view.style.top = 0
    this.app.view.style.left = 0

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
        maxWidth: window.innerWidth,
        maxheight: window.innerHeight
      })

    // Add events
    this.viewport.on('moved', () => {
      this.handleMove(); // @TODO - Throttle this for sure
      if (this.isMoving) return;
      this.isMoving = true
      console.log("starting to move");
    });
    this.viewport.on('moved-end', () => {
      this.isMoving = false
      console.log("aaaand we're done")
    });

    // Create boxes
    // Loop through each row
    Array(worldBoxCountRows).fill().forEach((_,i) => {
      // Loop through each column
      Array(worldBoxCountColumns).fill().forEach((_,j) => {
        // Create a box
        const box = this.viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        box.tint = 0xdee2fa
        box.width = box.height = boxSize
        const x = boxSize*j
        const y = boxSize*i
        box.position.set(x, y)

        // Add it to our array of boxes
        this.boxes.push(box)

        // Create a border
        const line = this.viewport.addChild(new PIXI.Graphics());
        line.lineStyle(1, 0xffffff).drawRect(x, y, x+boxSize, y+boxSize);

        // create a number label
        const boxNum = (i * worldBoxCountColumns) + j + 1
        const label = this.viewport.addChild(new PIXI.Text(`Box ${boxNum}`, { font: '25px Courier New', fill: 'black', align: 'left' }));
        label.position.x = x+5;
        label.position.y = y+5;
      })
    })   

    // Add a green border
    const line = this.viewport.addChild(new PIXI.Graphics());
    line.lineStyle(3, 0x6ca769).drawRect(0, 0, this.viewport.worldWidth, this.viewport.worldHeight);

    window.addEventListener('resize', this.handleResize);
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    document.body.style.overflow = ''
    this.app && this.app.destroy()
  }

  handleResize() {
    this.app && this.app.resize(window.inerWidth, window.innerHeight)
    // this.viewport && this.viewport.resize(window.innerWidth, window.innerHeight, worldWidth, worldHeight)
  }

  checkRectIntersection(r1, r2) {
    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top > r1.bottom ||
             r2.bottom < r1.top);
  }

  handleMove() {
    console.log('were moving')

    const intersectingBoxes = []
    const bounds = this.app.screen;
    const screenRect = {
      left: bounds.x,
      top: bounds.y,
      right: bounds.x + bounds.width,
      bottom: bounds.y + bounds.height
    }

    this.boxes.forEach((box, i) => {
      const r = box.getBounds(); // r = rectangle
      const boxRect = {
        left: r.x,
        top: r.y,
        right: r.x + r.width,
        bottom: r.y + r.height
      }      

      if (this.checkRectIntersection(screenRect, boxRect)) {
        intersectingBoxes.push((i+1))
        box.tint = 0xFF0000
      }
      else {
        // notttt
        box.tint = 0xdee2fa
      }
    })

    console.log(intersectingBoxes)
  }

  render() {
    return (
      <div ref={this.elRef} className="image-map" />
    )
  }
}

export default ImageMap