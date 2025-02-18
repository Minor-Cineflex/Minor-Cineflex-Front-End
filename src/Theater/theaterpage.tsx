import React from "react";
import "./responsive.css";

let list_day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TheaterPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#4C3A51] flex flex-col items-center">
            <header className="bg-white text-black h-20 fixed top-0 w-full flex items-center justify-center shadow-md z-10">
                <nav className="container mx-auto text-center text-lg font-semibold">
                    This is header Nav
                </nav>
            </header>
            
            <section id="chooseDay" className="mt-24 w-full px-4 flex flex-wrap justify-center gap-2">
                <div id="Today" className="border-2 border-orange-300 p-2 shadow-lg rounded-2xl bg-pink-900 w-full md:w-auto text-center">
                    <p className="text-yellow-400 text-2xl p-1">{list_day[0]}</p>
                </div>
                <div id="schedule" className="flex flex-wrap justify-center gap-2 border-2 border-orange-300 p-2 shadow-lg rounded-2xl">
                    {list_day.slice(1).map((day, index) => (
                        <div key={index} className="border-2 border-orange-300 p-2 shadow-lg rounded-2xl bg-pink-900 text-center">
                            <p className="text-yellow-400 text-lg">{day}</p>
                        </div>
                    ))}
                </div>
            </section>
                <section id="showtime" className="mt-10 grid grid-responsive w-full justify-items-center">
                    {Array.from({ length: 15 }).map((_, index) => (
                        <div key={index} className="w-72 h-40 bg-pink-700 border-2 border-orange-300 shadow-lg rounded-2xl flex     items-center justify-center">
                            <p className="text-yellow-400 text-lg">Showtime {index + 1}</p>
                        </div>
                    ))}
                </section>
            <footer className="bg-pink-900 text-white h-20 fixed bottom-0 w-full flex items-center justify-center">
                <div className="container mx-auto text-center">
                    <div className="text-black">&copy; This is Footer Nav</div>
                </div>
            </footer>
        </div>
    );
}

export default TheaterPage;