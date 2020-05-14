import React, { useRef, useEffect, useState } from 'react'
import { Shape, Image as KonvaImage } from 'react-konva'
import Konva from 'konva';
import part from '../tshirt-round-neck-men/mesh/front.png'
import onepiece from '../onepiece.jpg'
import d3_contour from '../utils/marchingAntsAlgorithm'
import { defineTransparent } from '../utils/defineNonTransparent'
import { debounce, throttle } from 'lodash'
import { Border } from '../utils/BorderV2'
import useImage from 'use-image'

const redraw = ctx => points =>  {
  ctx.beginPath();
  ctx.moveTo(points[0][0],points[0][1]);
  for(var i=1;i<points.length;i++){
      var point=points[i];
      ctx.lineTo(point[0],point[1]);
  }
  ctx.closePath();
  ctx.stroke();
  // ctx.beginPath();
  // ctx.moveTo(20, 50);
  // ctx.lineTo(220, 80);
  // ctx.quadraticCurveTo(150, 100, 260, 170);
  // ctx.closePath();

  // // (!) Konva specific method, it is very important
  // ctx.fillStrokeShape(this);
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
      console.log('Imageref', imageRef.current)
      const shape = imageRef.current
      shape.setAttrs({
        borderSize: 5,
        borderColor: 'red',
      })
      // const ctx = shape.getContext()
      // ctx.drawImage(back, 1000, 1000)
      // const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
      // console.log("PartsImage -> imgData", imgData)
      // Border.call(shape, imgData)
      // const points = d3_contour(defineTransparent(imgData)(ctx.canvas.width))
      // console.log("PartsImage -> points", points)
      // ctx.strokeStyle="red";
      // ctx.lineWidth=2;
      // redraw(ctx)(points)

      // you many need to reapply cache on some props changes like shadow, stroke, etc.
      shape.cache();
      // since this update is not handled by "react-konva" and we are using Konva methods directly
      // we have to redraw layer manually
      shape.getLayer().batchDraw()
    }
  }, [image])



  return (
      // <Shape
      //   ref={imageRef}

      //   sceneFunc={(ctx, image) => {

      //     ctx.drawImage(shirt, 0,0)

      //     // const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data
      //     ctx.globalCompositeOperation = 'source-in'
      //     ctx.drawImage(back, -image.x(), -image.y())

      //   }}
      //   hitFunc={(ctx, image) => {
      //     ctx.rect(0, 0, shirt.width, shirt.height)
      //     ctx.fillStrokeShape(image)
      //   }}
      //   draggable
      // />
      <KonvaImage
        image={image}
        ref={imageRef}
        filters={[Konva.Filters.Blur]}
        blurRadius={10}
        draggable
      />
  )
}