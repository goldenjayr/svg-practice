// Main Libraries
import React, { useState, useRef, useEffect } from 'react'
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
} from 'react-konva'
import Konva from 'konva'

// CSS Imports
import './App.css'

// SvG Imports
import { ReactComponent as Pattern } from './i-like-food.svg'
import Logo from './logo.svg'

// Image Imports
import onepiece from './onepiece.jpg'

// Component Imports
import Swatch from './components/Swatch'
import ShirtComponent from './components/ShirtComponent'
import OutlineComponents from './components/OutlineComponent'

// Utils Imports
import useImage from 'use-image'
import htmlToImage from 'html-to-image'
import { v4 as uuid } from 'uuid'


function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

function ModifiedSVG(props) {
  const { color, setSvg, setPatternColors } = props

  const svgRef = useRef()

  const setFill = (node) => (color) => {
    node.childNodes.forEach((node) => {
      Object.entries(color).forEach(([key, value]) => {
        if (key === node.dataset.swatchId) {
          node.style.fill = value
          if (node.childNodes.length > 0) {
            setFill(node)(color)
          }
        }
      })
    })
  }

  function generateSwatches(node) {
    node.childNodes.forEach((node) => {
      if (node.style.fill !== null) {
        const id = uuid()
        node.dataset.swatchId = id
        setPatternColors((state) => {
          return {
            ...state,
            [id]: generateRandomColor()
          }
        })
        if (node.childNodes.length > 0) {
          generateSwatches(node)
        }
      }
    })
  }

  useEffect(() => {
    generateSwatches(svgRef.current)
  }, [])

  useEffect(() => {
    setFill(svgRef.current)(color)
    setSvg(svgRef.current)
  }, [svgRef, color])

  return (
    <Pattern
      ref={svgRef}
      xmlns='http://www.w3.org/2000/svg'
      style={{ backgroundColor: color.background }}
    />
  )
}

function App() {
  const [patternColors, setPatternColors] = useState({
    background: generateRandomColor()
  })

  const [coords, setCoords] = useState({
    x: 0,
    y: 0
  })
  const [svg, setSvg] = useState()
  const [pic, setPic] = useState()

  useEffect(() => {
    if (svg) {
      htmlToImage
        .toSvgDataURL(svg)
        .then((data) => setPic(data))
        .catch((err) => console.log(err))
    }
  }, [svg, patternColors])

  const [image] = useImage(pic)
  const [onepieceImage] = useImage(onepiece)

  // const onChangeCompleteHandler = (color) => {
  //   setColor(color.hex)
  //   colorPickerToggler()
  // }

  const onChangeHandler = (ground) => (color) => {
    setPatternColors((state) => {
      return {
        ...state,
        [ground]: color.hex
      }
    })
  }

  return (
    <div className='App'>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <KonvaImage
            image={onepieceImage}
            opacity={0.05}
          />
        </Layer>
        <Layer>
          <ShirtComponent coords={coords} />
        </Layer>
        {/* <OutlineComponents coords={coords} setCoords={setCoords} /> */}
      </Stage>
      <Stage width={window.innerWidth / 2} height={window.innerHeight / 2}>
        <Layer clearBeforeDraw>
          <Rect
            width={window.innerWidth / 1.5}
            height={window.innerHeight / 1.5}
            fillPatternImage={image}
          />
        </Layer>
      </Stage>
      <div style={{ display: 'flex' }}>
        {Object.entries(patternColors).map(([key, value]) => {
          return (
            <Swatch
              key={key}
              ground={key}
              color={value}
              onChangeHandler={onChangeHandler}
            />
          )
        })}
      </div>
      <div style={{ opacity: '0', position: 'absolute', zIndex: '-100' }}>
        <ModifiedSVG
          setSvg={setSvg}
          color={patternColors}
          setPatternColors={setPatternColors}
        />
      </div>
    </div>
  )
}

export default App
