import React, { useState, useEffect, useRef } from 'react'
import { ChromePicker } from 'react-color'

export default function Swatch(props) {
  const { color, onChangeHandler, ground } = props
  const [displayColorPicker, setDisplayColorPicker] = useState(false)

  const handleDisplayColorPicker = () => {
    setDisplayColorPicker(!displayColorPicker)
  }

  const swatchRef = useRef()

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (swatchRef.current.contains(e.target)) return
      setDisplayColorPicker(false)
    })

    return () => document.removeEventListener('click')
  }, [])

  return (
    <div ref={swatchRef}>
      {displayColorPicker && (
        <ChromePicker color={color} onChange={onChangeHandler(ground)} />
      )}
      <svg width='40' height='40'>
        <circle
          cx='20'
          cy='20'
          r='20'
          fill={color}
          onClick={handleDisplayColorPicker}
        />
      </svg>
    </div>
  )
}
