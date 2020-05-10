import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import { Stage, Layer, Rect, Text, Image } from 'react-konva'
import Konva from 'konva'
import { ReactComponent as Pattern } from './i-like-food.svg'
import Logo from './logo.svg'
import useImage from 'use-image'
import ReactDOMServer from 'react-dom/server'
import Swatch from './components/Swatch'
import { ReactSVG } from 'react-svg'
import svgToMiniDataURI from 'mini-svg-data-uri'
import { css } from 'glamor'
import htmlToImage from 'html-to-image'
import Upload from './components/Upload'
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
        console.log(node)
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
  console.log('App -> patternColors', patternColors)

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
      <Stage width={window.innerWidth / 1.5} height={window.innerHeight / 1.5}>
        <Layer>
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
      <div style={{ opacity: '0',  position: 'absolute', zIndex: '-100' }}>
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
