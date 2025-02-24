import React, { useState, useEffect } from "react";
import "./responsive.css";
import movieData from "./test.json";
import Calendar from "react-calendar"; // นำเข้า react-calendar

const TheaterPage: React.FC = () => {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [prevScroll, setPrevScroll] = useState(0);
    const [isFooterVisible, setIsFooterVisible] = useState(true);
    const [movieList, setMovieList] = useState(movieData.movie_list);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [isCalendarVisible, setIsCalendarVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > prevScroll) {
                setIsNavbarVisible(false);
            } else {
                setIsNavbarVisible(true);
            }
            setPrevScroll(currentScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [prevScroll]);

    const handleDayClick = (date: Date) => {
        setSelectedDay(date);
    };

    return (
        <div id="headerNav" className="min-h-screen bg-[#4C3A51] flex flex-col items-center">
            <header className={`bg-white text-black h-20 fixed top-0 w-full flex items-center justify-center shadow-md z-10 transition-transform duration-500 ${isNavbarVisible ? "translate-y-0" : "-translate-y-full"}`}>
                <nav className="container mx-auto text-center text-lg font-semibold">
                    This is header Nav
                </nav>
            </header>
            <section id="chooseDay" className="mt-24 w-full px-4 flex flex-wrap items-start gap-2 pl-4">
                <div id="Today" className="h-16 border-2 border-orange-300 p-2 shadow-lg rounded-2xl bg-[#B25068] w-full md:w-auto text-center flex items-center justify-between">
                    <p className="text-yellow-400 text-2xl p-1">You choose : {selectedDay.toLocaleDateString()}</p>
                    <button onClick={() => setIsCalendarVisible(!isCalendarVisible)} className="ml-2 text-yellow-400 p-2 rounded-lg bg-[#774360] hover:bg-[#FF9F00] transition-all">
                        {isCalendarVisible ? "Hide Calendar" : "Show Calendar"}
                    </button>
                </div>
                {isCalendarVisible && (
                    <div id="calendar" className="border-2 border-orange-300 p-4 shadow-lg rounded-2xl bg-[#4C3A51]">
                        <Calendar
                            onChange={handleDayClick}
                            value={selectedDay}
                            className="custom-calendar"
                        />
                    </div>
                )}
            </section>
            <section id="showtime" className="mt-8 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4 justify-items-center">
                {movieList.map((movie, index) => (
                    <div key={index} className="w-full max-w-xs bg-[#774360] border-2 border-orange-300 shadow-lg rounded-2xl flex flex-col items-center p-4 mb-6">
                        <div className="text-center text-white flex flex-col justify-between flex-grow">
                            <p className="text-yellow-400 text-xl font-semibold">{movie.movie_title}</p>
                            <div className="mt-auto">
                                <p className="text-yellow-300 text-sm">{movie.dubbed_language}/{movie.subtitles_language} | Theater {movie.theater} | {movie.theater_type}</p>
                                <p className="text-yellow-300 text-sm">{new Date(movie.start_time).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <button onClick={() => setIsFooterVisible(!isFooterVisible)} className={`fixed right-5 bg-[#774360] text-white px-4 py-2 rounded-lg shadow-lg z-20 transition-all duration-500 ${isFooterVisible ? "bottom-24" : "bottom-5"}`}>
                {isFooterVisible ? "Hide" : "Show"}
            </button>
            <footer id="footerNav" className={`bg-[#B25068] text-white h-20 fixed bottom-0 w-full flex items-center justify-center transition-transform duration-500 ${isFooterVisible ? "translate-y-0" : "translate-y-full"}`}>
                <div className="container mx-auto text-center">
                    <div className="text-black text-3xl font-semibold flex translate-x-10">BUY TICKET</div>
                </div>
            </footer>
        </div>
    );
}

export default TheaterPage;
