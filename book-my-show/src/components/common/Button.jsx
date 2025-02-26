import React from 'react'

const Button = ({ label, type, loading, classNames, onClickHandler }) => {
  return (
    <button
      type={type}
      className={`bg-red-100 p-2 rounded-md text-white hover:bg-red-90 ${classNames}`}
      onClick={onClickHandler}
      >
        {loading ? 'Loading ...' : label}
    </button>
  )
}

export default Button