import React from 'react'

const Button = ({ bgColor, color, size, text, borderRadius, onClick }) => {
  return (
    <button type='button' style={{
      backgroundColor: bgColor, color, borderRadius
    }}
    className={`text-${size} p-3 hover:drop-shadow-xl ml-2`}
    onClick={() => {
      onClick && onClick();
    }}
    >
      {text}
    </button>
  )
}

export default Button