import React, { useRef, useEffect, useState } from 'react'
import { Layer, Image as KonvaImage } from 'react-konva'
import Konva from 'konva'
import shirt from '../lightning.png'
import onepiece from '../onepiece.jpg'
import useImage from 'use-image'
import { Border } from '../utils/Border'

export default function OutlineComponent() {
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
        filters={[Border]}
        borderSize={10}
        borderColor='red'
      />
    </Layer>
  )
}