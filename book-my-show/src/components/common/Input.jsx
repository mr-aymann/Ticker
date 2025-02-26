import React from 'react'

const Input = ({ type, placeholder, name, onChangeHandler, error }) => {
    return (
        <div className='flex justify-start items-start gap-2 flex-col w-full'>
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                className={`border border-gray-100 w-full p-3 rounded-md ${error && 'border-red-100'}`}
                onChange={onChangeHandler}
            />
            {error && <p className='text-xs text-red-100'>{error}</p>}
        </div>
    )
}

export default Input