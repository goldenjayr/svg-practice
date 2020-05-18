import React, { useRef, useEffect, useState } from 'react'
import { Shape, Image as KonvaImage } from 'react-konva'
import Konva from 'konva'
import part from '../butterfly.png'
// import part from '../tshirt-round-neck-men/mesh/front.png'
import onepiece from '../onepiece.jpg'
import d3_contour from '../utils/marchingAntsAlgorithm'
import { defineTransparent } from '../utils/defineNonTransparent'
import { debounce, throttle } from 'lodash'
import { Border } from '../utils/Border'
import useImage from 'use-image'

const drawOutline = (ctx) => (points) => {
  const width = ctx.canvas.width
  console.log("drawOutline -> width", width)
  const height = ctx.canvas.height
  console.log("drawOutline -> height", height)
  const xOffset = 23
  const yOffset = 12
  ctx.beginPath()
  ctx.moveTo(points[0][0] - xOffset, points[0][1] - yOffset)
  for (var i = 1; i < points.length; i++) {
    var point = points[i]
    ctx.lineTo(point[0] - xOffset, point[1] - yOffset)
  }
  ctx.closePath()
  ctx.stroke()
}

export default function PartsImage() {
  const shirt = new Image()
  shirt.src = part
  const back = new Image()
  back.src = onepiece
  const [image] = useImage(part, 'anonymous')
  const [state, setState] = useState({
    isDragging: false,
    x: 0,
    y: 0
  })
  const imageRef = useRef()

  useEffect(() => {
    if (image) {
      const shape = imageRef.current

      const ctx = shape.getContext()

      const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
      const points = d3_contour(defineTransparent(imgData.data)(ctx.canvas.width))
      const layer = shape.getLayer()

      const outline = new Konva.Shape({
        sceneFunc: function (context, shape) {
        console.log("PartsImage -> shape", shape.x())
          drawOutline(context)(points)
          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape)
        },
        stroke: 'red',
        strokeWidth: 4,
        draggable: true
      })

      outline.on('dragmove', (e) => {
        console.log('Dragstart')
        setState((state) => ({
          ...state,
          isDragging: true,
          x: e.target.x(),
          y: e.target.y()
        }))
      })
      layer.add(outline)

      // you many need to reapply cache on some props changes like shadow, stroke, etc.
      shape.cache()

      // since this update is not handled by "react-konva" and we are using Konva methods directly
      // we have to redraw layer manually
      shape.getLayer().batchDraw()
    }
  }, [image])

  return (
    <Shape
      ref={imageRef}
      x={state.x}
      y={state.y}
      sceneFunc={(ctx, shape) => {
        console.log("PartsImage -> shape 1", shape.x())
        ctx.drawImage(shirt, 0, 0, ctx.canvas.width / 2, ctx.canvas.height / 2)

        // const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        // const points = d3_contour(defineTransparent(imgData.data)(ctx.canvas.width))
        // drawOutline(ctx)(points)

        ctx.globalCompositeOperation = 'source-in'
        ctx.drawImage(back, -shape.x(), -shape.y())
      }}
      hitFunc={(ctx, image) => {
        ctx.rect(0, 0, shirt.width, shirt.height)
        ctx.fillStrokeShape(image)
      }}
    />
  )
}
