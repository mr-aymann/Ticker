import React, { useState } from 'react'

const Seat = ({ value, seatNo, row, seatClass, index, seatPrice, selectSeatHandler, selectedSeat }) => {

    const onSeatSelectHandler = () => {
        if(value == "free"){
            selectSeatHandler({
                seat_row: row,
                seat_number: seatNo,
                seat_class: seatClass,
                seat_price: seatPrice,
                quantity: 1,
                seat_index: index
            })
        }
    }

    return (
        <div
            key={index}
            className={`flex justify-center items-center text-xs w-6 h-6 rounded-sm border  ${value == "gap" ? 'invisible' : value == "booked" ? 'bg-gray-100 text-white cursor-not-allowed' : 'border-green-500 text-green-500 cursor-pointer hover:bg-green-600 hover:border-green-600 hover:text-white'} ${(selectedSeat.seat_row == row && selectedSeat.seat_number == seatNo && selectedSeat.seat_class == seatClass) ? 'bg-green-600 border border-green-600 text-white' : null}`}
            onClick={onSeatSelectHandler}
        >
            {seatNo}
        </div>
    )
}

export default Seat