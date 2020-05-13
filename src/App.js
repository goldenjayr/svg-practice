import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Shape,
  Group
} from 'react-konva'
import Konva from 'konva'
import { ReactComponent as Pattern } from './i-like-food.svg'
import Logo from './logo.svg'
import useImage from 'use-image'
import Swatch from './components/Swatch'
import part from './tshirt-round-neck-men/mesh/front.png'
import onepiece from './art-10.jpg'
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

function PartsImage({ base }) {
  console.log("PartsImage -> base", base)
  const [image2, setImage2] = useState()
  console.log("PartsImage -> image2", image2)
  const shirt = new Image()
  shirt.src = part
  const back = new Image()
  back.src = onepiece

  return (
    <Group>
      <Shape
        sceneFunc={(ctx, image) => {
          ctx.drawImage(shirt, 0, 0)
          ctx.globalCompositeOperation = 'source-in'
          ctx.drawImage(back, -image.x(), -image.y())
        }}
        hitFunc={(ctx, image) => {
          ctx.rect(0, 0, shirt.width, shirt.height)
          ctx.fillStrokeShape(image)
        }}
        draggable
      />

    </Group>
  )
}

function App() {
  const [patternColors, setPatternColors] = useState({
    background: generateRandomColor()
  })

  const [svg, setSvg] = useState()
  const [pic, setPic] = useState()
  const base = useRef()

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
      <Stage width={window.innerWidth / 2} height={window.innerHeight / 2}>
        <Layer>
          <KonvaImage
            image={onepieceImage}
            opacity={0.05}
          />
        </Layer>
        <Layer>
          <PartsImage />
        </Layer>
      </Stage>
      <Stage width={window.innerWidth / 2} height={window.innerHeight / 2}>
        <Layer ref={base}>
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
