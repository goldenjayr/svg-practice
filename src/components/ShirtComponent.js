import React, { useRef, useEffect, useState } from 'react'
import { Shape, Image as KonvaImage } from 'react-konva'
import Konva from 'konva';
import part from '../lightning.png'
// import part from '../tshirt-round-neck-men/mesh/front.png'
import onepiece from '../onepiece.jpg'
import d3_contour from '../utils/marchingAntsAlgorithm'
import { defineTransparent } from '../utils/defineNonTransparent'
import { debounce, throttle } from 'lodash'
import { Border } from '../utils/Border'
import useImage from 'use-image'

const drawOutline = ctx => points =>  {
  ctx.strokeStyle="red";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(points[0][0],points[0][1]);
  for(var i=1;i<points.length;i++){
      var point=points[i];
      ctx.lineTo(point[0],point[1]);
  }
  ctx.closePath();
  ctx.stroke();

}

export default function PartsImage({ base }) {
  const shirt = new Image()
  shirt.src = part
  const back = new Image()
  back.src = onepiece
  const [image] = useImage(part, 'Anonymous')

  const imageRef = useRef()


  useEffect(() => {
    if (image) {
      const shape = imageRef.current
      console.log("PartsImage -> shape", shape)

      // const ctx = shape.getContext()
      // const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data
      // console.log("PartsImage -> imgData", imgData)
      // // Border.call(shape, imgData)
      // const points = d3_contour(defineTransparent(imgData)(ctx.canvas.width))
      // console.log("PartsImage -> points", points)


      // redraw(ctx)(points)

      // you many need to reapply cache on some props changes like shadow, stroke, etc.
      shape.cache();

      // since this update is not handled by "react-konva" and we are using Konva methods directly
      // we have to redraw layer manually
      shape.getLayer().batchDraw()
    }
  }, [image])



  return (
      <Shape
        ref={imageRef}
        draggable
        sceneFunc={(ctx, shape) => {

          ctx.drawImage(shirt, 0,0)

          const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
          const points = d3_contour(defineTransparent(imgData.data)(ctx.canvas.width))
          drawOutline(ctx)(points)

          // ctx.globalCompositeOperation = 'source-in'
          // ctx.drawImage(back, -shape.x(), -shape.y())

        }}
        hitFunc={(ctx, image) => {
          ctx.rect(0, 0, shirt.width, shirt.height)
          ctx.fillStrokeShape(image)
        }}
      />
      // <KonvaImage
      //   image={image}
      //   ref={imageRef}
      //   filters={[Konva.Filters.Blur]}
      //   blurRadius={10}
      //   draggable
      // />
  )
}