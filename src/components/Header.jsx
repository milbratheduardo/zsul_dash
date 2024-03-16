import React from 'react'

const Header = ({ category, title, subtitle }) => {
  return (
    <div className='mb-10'>
      <p className='text-gray-400'>{category}</p>
      <p className='text-3xl font-extrabold tracking-tight text-slate-900'>{title}</p>
      {subtitle && (
        <p className='text-lg font-semibold text-gray-600'>{subtitle}</p>
      )}
    </div>
  )
}

export default Header