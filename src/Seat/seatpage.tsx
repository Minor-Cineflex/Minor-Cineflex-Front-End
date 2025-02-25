import React from "react";
import Chair from "./chair.png"
import Ocp from "./occupied.png"
import choose from "./choose.png"
import { constants } from "buffer";
import { useState } from "react";

import data from "./test.json"




const SeatPage: React.FC = () => {
    const fullrow = 4
    const fullcol=8

    const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

    const encoded = (row,col) => {
        return `${String.fromCharCode(65 + (fullrow-row-1))}${col+1}`
    }

    const handleClick = (row,col) => {
        setSelectedSeats((prev) => {
            const newSeat = new Set(prev)
            const seatKey = encoded(row,col)
            newSeat.has(seatKey) ? newSeat.delete(seatKey) : newSeat.add(seatKey)
            return newSeat
        })
    }

    const Seat = (row, col) => {
        return data[row + 1][col + 1] ? <img src={selectedSeats.has(encoded(row,col)) ? choose : Chair} alt="" onClick={() => handleClick(row, col)}  /> : <img src={Ocp} alt="" />
    }
    
    const Seat_table = () => {
        return <div className="grid grid-cols-8 gap-8 px-8">
            {Array.from({length:fullrow}).map((_,i) =>
                Array.from({length: fullcol}).map((_,j) => (
                    Seat(i,j)
                ))
            )}
        </div>
    }

    const out = () => {
        console.log("Selected Seats:", [...selectedSeats])
    }

    return(
        <div className="min-w-full min-h-screen bg-[#4C3A51] flex flex-col justify-center items-center" >
          
            <div className="max-w-6xl flex flex-col items-center justify-center">
                <div className="w-full border-4 border-[#E7AB79]">
                    <p className="m-3 text-center text-[#D9D9D9] text-opacity-60 text-3xl font-bold">
                        Screen
                    </p>
                </div>
                <div className="flex items-center justify-center p-8" >
                     {Seat_table()}
                </div>
                <button onClick={() => out()} className="bg-gray-100 border-4 border-gray-300 rounded-2xl">
                    <p className="m-3 text-center text-gray-500 text-opacity-60 text-xl font-bold">
                        Done
                    </p>
                </button>
            </div>
        </div>
    )
}

export default SeatPage