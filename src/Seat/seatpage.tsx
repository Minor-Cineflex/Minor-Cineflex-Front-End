import React, { use } from "react";
import Chair from "./chair.png"
import Ocp from "./occupied.png"
import choose from "./choose.png"
import { constants } from "buffer";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom";




import tmpdata from "./test.json"




const SeatPage: React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state || {};


    const [SeatList, setSeatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const [showtime_id,setShowtimeId] = useState<string>("");
    const [user_id, setUser_id] = useState<string>("");

    useEffect(() => {
        console.log(state)
        setUser_id(state.user_id);
        setShowtimeId("S001");
    }, []);
    

    useEffect(() => {
        if (!showtime_id) return;
        const fetchCinemas = async () => {
            try {
                const response = await fetch(`http://localhost:8000/minorcineflex/seat/${state.showtimeId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch Seat list");
                }

                const data = await response.json();
                const list = data["Seat"];
                
                setSeatList(list);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
      
        fetchCinemas();
    }, [showtime_id]);

    const fullrow = 4
    const fullcol=8

    const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
    const [outputSeat,  setOutputSeat] = useState<Set<string>>(new Set());

    const encoded = (row,col) => {
        return `${String.fromCharCode(65 + (fullrow-row-1))}${col+1}`
    }

    const handleClick = (row,col,seat_id) => {
        setSelectedSeats((prev) => {
            const newSeat = new Set(prev)
            const seatKey = encoded(row,col)
            newSeat.has(seatKey) ? newSeat.delete(seatKey) : newSeat.add(seatKey)
            return newSeat
        })
        setOutputSeat((prev) => {
            const newSeat = new Set(prev)
            const seatKey = seat_id
            newSeat.has(seatKey) ? newSeat.delete(seatKey) : newSeat.add(seatKey)
            return newSeat
        })
    }

    const Seat = (row, col) => {
        const seat = SeatList.find(seat => seat["row"] === String.fromCharCode(64+(fullrow-row)) && seat["col"] === col+1);
        if(!seat){
            return <img src={Ocp} alt="" />
        }
        return seat["status"] ? <img src={selectedSeats.has(encoded(row,col)) ? choose : Chair} alt="" onClick={() => handleClick(row, col,seat["seat_id"])}  /> : <img src={Ocp} alt="" />
    }
    
    const Seat_table = () => {
        return <div style={{ gridTemplateColumns: `repeat(${fullcol}, 1fr)` }} className={`grid gap-8 px-8`}>
            {Array.from({length:fullrow}).map((_,i) =>
                Array.from({length: fullcol}).map((_,j) => (
                    Seat(i,j)
                ))
            )}
        </div>
    }
     const [response, setResponse] = useState<string>("");
    const out = async () => {
        console.log("Selected Seats:", [...selectedSeats])
        console.log("Selected Seats ID:", [...outputSeat])
        console.log(JSON.stringify({ outputseat : [...outputSeat] , user_id, showtime_id: state.showtimeId }) )

       if(state.user_id){
            try {
                const response = await fetch("http://localhost:8000/minorcineflex/reserve_seat", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ outputSeat : [...outputSeat],user_id, showtime_id: state.showtimeId}) 
                });

                if (!response.ok) {
                    throw new Error("Failed to send list");
                }

                const data = await response.json();
                setResponse(JSON.stringify(data, null, 2));  // Store response
            } catch (error) {
                setResponse(`Error: ${error.message}`);
            }
        }
        else{
            navigate("/Login", {state});
        }

        
    
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