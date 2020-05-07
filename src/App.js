import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import { Stage, Layer, Rect, Text, Image } from 'react-konva'
import Konva from 'konva'
import { ReactComponent as Pattern } from './covid.svg'
import Logo from './logo.svg'
import useImage from 'use-image'
import ReactDOMServer from 'react-dom/server'
import Swatch from './components/Swatch'
import { ReactSVG } from 'react-svg'
import svgToMiniDataURI from 'mini-svg-data-uri'
import { css } from 'glamor'
import htmlToImage from 'html-to-image'
import Upload from './components/Upload'


function ModifiedSVG(props) {
  const { color, setSvg, setPatternColors } = props

  const svgRef = useRef()

  function setFill(node) {
    node.childNodes.forEach(node => {
      console.log(node.style.fill)
      if(node.style.fill !== null) {
        node.style.fill = `${color.foreground}`
        if (node.childNodes.length > 0) {
          setFill(node)
        }
      }
    })
  }

  function generateSwatches(node, cnt) {
    let count = cnt || 0
    node.childNodes.forEach(node => {
      if(node.style.fill !== null) {
        setPatternColors(state => {
          return {
            ...state,
            [`color${count++}`]: node.style.fill
          }
        })
        if (node.childNodes.length > 0) {
          generateSwatches(node, count)
        }
      }
    })
  }

  useEffect(() => {
    generateSwatches(svgRef.current)
    // setFill(svgRef.current)
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
    background: 'orange'
  })
  console.log("App -> patternColors", patternColors)

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
      <Stage width={window.innerWidth / 2} height={window.innerHeight / 3}>
        <Layer>
          <Rect
            width={window.innerWidth / 2}
            height={window.innerHeight / 3}
            fillPatternImage={image}
          />
        </Layer>
      </Stage>
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
      <ModifiedSVG setSvg={setSvg} color={patternColors} setPatternColors={setPatternColors} />
    </div>
  )
}

export default App
