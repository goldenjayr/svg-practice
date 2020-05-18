import React, { useRef, useEffect, useState } from 'react'
import { Layer, Image as KonvaImage } from 'react-konva'
import Konva from 'konva'
import shirt from '../tshirt-round-neck-men/mesh/front.png'
import onepiece from '../onepiece.jpg'
import useImage from 'use-image'
import { Border } from '../utils/Border'
import { Mask } from '../utils/Mask'

export default function OutlineComponent({setCoords}) {
  const [image] = useImage(shirt)
  const imageRef = useRef()
   const back = new Image()
  back.src = onepiece

  useEffect(() => {
    if (image) {
      console.log('imgaeref', imageRef.current)

      imageRef.current.cache()
      imageRef.current.getLayer().batchDraw()
    }
  }, [image])

  return (
    <Layer>
      <KonvaImage
        ref={imageRef}
        image={image}
        draggable
        filters={[Border, Konva.Filters.Enhance]}
        enhance={100}
        onDragMove={(event) => {
          setCoords({
            x: event.target.x(),
            y: event.target.y()
          })
        }}
        borderSize={2}
        borderColor='red'
      />
    </Layer>
  )
}