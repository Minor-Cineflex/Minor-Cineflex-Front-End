import React, { useState, useEffect } from "react";
import movieData from "./test.json";
import Calendar from "react-calendar";

const TheaterPage: React.FC = () => {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [prevScroll, setPrevScroll] = useState(0);
    const [isFooterVisible, setIsFooterVisible] = useState(true);
    const [movieList, setMovieList] = useState(movieData.showtime_list);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);

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

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filteredMovies = movieList.filter(movie =>
        formatDate(new Date(movie.start_date)) === formatDate(selectedDay)
    );

    const groupedMovies = filteredMovies.reduce((groups: any, movie) => {
        const movieKey = `${movie.movie}_${formatDate(new Date(movie.start_date))}`;
        if (!groups[movieKey]) {
            groups[movieKey] = { movie, times: [] };
        }
        groups[movieKey].times.push(new Date(movie.start_date));
        return groups;
    }, {});

    return (
        <div id="headerNav" className="min-h-screen bg-[#4C3A51] flex flex-col items-center">
            <header className={`bg-white text-black h-20 fixed top-0 w-full flex items-center justify-center shadow-md z-10 transition-transform duration-500 ${isNavbarVisible ? "translate-y-0" : "-translate-y-full"}`}>
                <nav className="container mx-auto text-center text-lg font-semibold">
                    This is header Nav
                </nav>
            </header>
            <section id="chooseDay" className="pt-3 mt-24 w-full px-4 flex flex-wrap items-start gap-2 pl-4">
                <div id="Today" className="h-16 border-2 border-orange-300 p-2 shadow-lg rounded-2xl bg-[#B25068] w-full md:w-auto text-center flex items-center justify-between">
                    <p className="text-yellow-400 text-2xl p-1 font-semibold">You choose : {selectedDay.toLocaleDateString()}</p>
                    <button onClick={() => setIsCalendarVisible(!isCalendarVisible)} className="ml-2 text-white p-2 rounded-lg bg-[#774360] hover:bg-[#FF9F00] transition-all">
                        {isCalendarVisible ? "Hide Calendar" : "Show Calendar"}
                    </button>
                </div>
                <div id="calendar" className={`border-2 border-orange-300 p-2 shadow-lg rounded-2xl bg-[#4C3A51] transition-all duration-500 ease-in-out transform ${isCalendarVisible ? 'opacity-100 translate-y-0 translate-x-0' : 'opacity-0 translate-y-10'} w-64`}>
                    {isCalendarVisible && (
                        <Calendar
                            onChange={handleDayClick}
                            value={selectedDay}
                            className="custom-calendar"
                        />
                    )}
                </div>
            </section>
            <section id="showtime" className="px-4">
                <div className="mt-10 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-12 w-full px-8 justify-items-center">
                    {Object.keys(groupedMovies).length > 0 ? (
                        Object.keys(groupedMovies).map((key, index) => {
                            const movieGroup = groupedMovies[key];
                            return (
                                <div key={index} className="bg-black/20 rounded-2xl text-center w-full max-w-xs flex flex-col h-full p-4">
                                    <div className="bg-[#774360] border-2 border-orange-300 shadow-lg rounded-2xl flex flex-col items-center h-full gap-y-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                        <div className="w-full h-full bg-gray-500 rounded-2xl overflow-hidden relative group">
                                            <img src="" alt={movieGroup.movie.movie} className="w-full h-full object-cover object-center" />
                                        </div>
                                    </div>
                                    <div className="mt-auto mt-5">
                                        <p className="text-yellow-300 text-xl font-semibold pb-2">{movieGroup.movie.movie}</p>
                                        <p className="text-yellow-300 text-m">{movieGroup.movie.theater}</p>
                                        <p className="text-yellow-300 text-m">{formatDate(new Date(movieGroup.movie.start_date))}</p>
                                        <div className="flex flex-wrap gap-2 mt-4 w-full justify-center">
                                            {movieGroup.times.map((time, timeIndex) => (
                                                <button
                                                    key={timeIndex}
                                                    className={`px-4 py-2 rounded-lg bg-[#774360] text-white hover:bg-[#FF9F00] transition-all`}
                                                    onClick={() => setSelectedShowtime(formatTime(time))}
                                                >
                                                    {formatTime(time)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-yellow-400 text-2xl font-semibold text-center w-full">No movies available for this day</p>
                    )}
                </div>
            </section>
            <button onClick={() => setIsFooterVisible(!isFooterVisible)} className={`fixed right-5 bg-[#774360] hover:bg-[#FF9F00] text-white px-4 py-2 rounded-lg shadow-lg z-20 transition-all duration-500 ${isFooterVisible ? "bottom-24" : "bottom-5"}`}>
                {isFooterVisible ? "Hide" : "Show"}
            </button>
            <footer id="footerNav" className={`bg-[#B25068] text-white h-20 fixed bottom-0 w-full flex items-center justify-center transition-transform duration-500 ${isFooterVisible ? "translate-y-0" : "translate-y-full"}`}>
                <div className="container mx-auto text-center">
                    <div className="text-black text-3xl font-semibold flex translate-x-10">BUY TICKET</div>
                </div>
            </footer>
        </div>
    );
};

export default TheaterPage;
