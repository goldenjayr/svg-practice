import React, {useState, useEffect, useRef} from 'react'
import { ChromePicker } from 'react-color'

export default function Swatch(props) {
  const { color, onChangeHandler, ground } = props
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const handleDisplayColorPicker = () => {
    setDisplayColorPicker(!displayColorPicker)
  }


  return (
    <div>
      {displayColorPicker && <ChromePicker color={color} onChange={onChangeHandler(ground)} />}
      <svg width='40' height='40'>
        <circle cx='20' cy='20' r='20' fill={color} onClick={handleDisplayColorPicker} />
      </svg>
    </div>
  )
}
