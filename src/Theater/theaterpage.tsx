import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar_style.css';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Footerbar from "../component/footerbar/footerbar.tsx";
import Headerbar from "../component/header/headerbar.tsx";

interface Movie {
    movie_id: string;
    name: string;
    img: string;
}

interface Theater {
    theater_id: string;
    theater_name: string;
    audio_type: string;
    video_type: string;
}

interface Showtime {
    showtime_id: string;
    movie_id: string;
    theater_id: string;
    start_date: string;
}

interface TimeInfo {
    time: Date;
    showtimeId: string;
    movieId: string;
    theaterId: string;
}

const TheaterPage: React.FC = () => {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [prevScroll, setPrevScroll] = useState(0);
    const [isFooterVisible, setIsFooterVisible] = useState(true);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
    const [showtimeList, setShowtimeList] = useState<Showtime[]>([]);
    const [movieList, setMovieList] = useState<Movie[]>([]);
    const [theaterList, setTheaterList] = useState<Theater[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};


    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            setIsNavbarVisible(currentScroll <= prevScroll);
            setPrevScroll(currentScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScroll]);

    useEffect(() => {
        const fetchShowtime = async () => {
            try {
                const response = await fetch(`http://localhost:8000/minorcineflex/cinema/${state.cinema_id}/showtime`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch showtime");
                const data = await response.json();
                if (state.movie_id) {
                    setShowtimeList(data.filter((showtime: Showtime) => showtime.movie_id === state.movie_id));
                }
                else {
                    setShowtimeList(data);
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        const fetchMovie = async () => {
            try {
                const response = await fetch('http://localhost:8000/minorcineflex/movie', {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch movie");
                const data = await response.json();
                console.log(data);
                setMovieList(data.movie_list || []);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        const fetchTheater = async () => {
            try {
                const response = await fetch(`http://localhost:8000/minorcineflex/cinema/${state.cinema_id}/theater`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch theater");
                const data = await response.json();
                setTheaterList(data || []);
                console.log(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
        fetchTheater();
        fetchShowtime();
    }, []);

    const handleShowtimeSelect = (showtime: {
        showtimeId: string,
        movieId: string,
        theaterId: string,
        theaterName: string,
        movieName: string,
        startDateTime: {
            date: string,
            time: string,
            isoString: string
        }
    }) => {
        console.log('Selected Showtime Details:', {
            showtimeId: showtime.showtimeId,
            movieId: showtime.movieId,
            theaterId: showtime.theaterId,
            theaterName: showtime.theaterName,
            movieName: showtime.movieName,
            date: showtime.startDateTime.date,
            startTime: showtime.startDateTime.time
        });

        navigate(`/Seat/${state.cinema_id}/${showtime.movieName}/${showtime.theaterId}`, {
            state: {
                ...state,
                showtimeId: showtime.showtimeId,
                movieId: showtime.movieId,
                theaterId: showtime.theaterId,
                theaterName: showtime.theaterName,
                movieName: showtime.movieName,
                startDateTime: showtime.startDateTime
            }
        });
    };

    const handleDayClick = (date: Date) => {
        setSelectedDay(date);
    };

    const formatDate = (date: Date) => date.toLocaleDateString();
    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const formatFullDateTime = (date: Date) => ({
        date: formatDate(date),
        time: formatTime(date),
        isoString: date.toISOString()
    });

    const filteredMovies = showtimeList.filter(movie => formatDate(new Date(movie.start_date)) === formatDate(selectedDay));

    // Define a more explicit type for the grouped movies
    interface GroupedMovie {
        movie: {
            name: string;
            movie_id: string;
            start_date: string;
        };
        img: string;
        theater?: Theater;
        times: Date[];
    }

    const groupedMovies = filteredMovies.reduce((groups: Record<string, GroupedMovie>, showtime) => {
        const matchedMovie = movieList.find(movie => movie.movie_id === showtime.movie_id);
        const movieName = matchedMovie ? matchedMovie.name : 'Unknown Movie';
        const movieImg = matchedMovie ? matchedMovie.img : 'https://via.placeholder.com/200x300?text=No+Image';

        const movieTheater = theaterList.find(theater => theater.theater_id === showtime.theater_id);

        const movieKey = `${movieName}_${formatDate(new Date(showtime.start_date))}_${showtime.theater_id}`;

        if (!groups[movieKey]) {
            groups[movieKey] = {
                movie: {
                    ...showtime,
                    name: movieName
                },
                img: movieImg,
                theater: movieTheater,
                times: []
            };
        }
        groups[movieKey].times.push({
            time: new Date(showtime.start_date),
            showtimeId: showtime.showtime_id,
            movieId: showtime.movie_id,
            theaterId: showtime.theater_id
        });

        return groups;
    }, {});

    return (
        <div className="bg-[#4C3A51] w-screen max-w-screen h-screen flex flex-col items-center overflow-y-auto">
            <Headerbar userAccountId={state.account_id} />
            <section className="pb-4 mt-5 px-4">
                <div className="p-4 border-2 border-orange-300 shadow-lg rounded-2xl bg-[#B25068] text-center flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3 w-full justify-center">
                        <p className="text-yellow-400 text-2xl">You choose: {formatDate(selectedDay)}</p>
                        <button
                            onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                            className="bg-[#774360] text-white p-2 rounded-lg hover:bg-pink-900"
                        >
                            {isCalendarVisible ? "Hide Calendar" : "Show Calendar"}
                        </button>
                    </div>
                    {isCalendarVisible && (
                        <div className="ml-auto bg-[#4C3A51] p-2 rounded-xl border-2 border-orange-300 shadow-lg">
                            <Calendar
                                onChange={handleDayClick}
                                value={selectedDay}
                                calendarType="gregory"
                            />
                        </div>
                    )}
                </div>
            </section>
            <section id="showtime" className="px-4 w-full">
                {Object.keys(groupedMovies).length > 0 ? (
                    Object.entries(groupedMovies).map(([key, { movie, img, theater, times }], index) => (
                        <div key={index} className="bg-black/20 rounded-2xl text-center p-4 mb-4 flex flex-col md:flex-row items-center">
                            <div className="w-48 h-72 mb-4 md:mb-0 md:mr-4">
                                <img
                                    src={img}
                                    alt={movie.name}
                                    className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                            </div>
                            <div className="flex-grow">
                                <p className="text-yellow-300 text-xl mb-2">{movie.name}</p>
                                <p className="text-yellow-200 text-sm mb-4">
                                    Theater: {theater && theater.theater_name ? theater.theater_name : 'Unknown'} |
                                    Audio Type: {theater && theater.audio_type ? theater.audio_type : 'Unknown'} |
                                    Video Type: {theater && theater.video_type ? theater.video_type : 'Unknown'}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 cursor-pointer;">
                                    {times.map((timeInfo, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleShowtimeSelect({
                                                showtimeId: timeInfo.showtimeId,
                                                movieId: timeInfo.movieId,
                                                theaterId: timeInfo.theaterId,
                                                theaterName: theater && theater.theater_name ? theater.theater_name : 'Unknown',
                                                movieName: movie.name,
                                                startDateTime: formatFullDateTime(timeInfo.time)
                                            })}
                                            className="bg-[#774360] text-white p-2 rounded-lg hover:bg-[#B25068]"
                                        >
                                            {formatTime(timeInfo.time)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-yellow-400 text-2xl text-center">No movies available for this day</p>
                )}
            </section>
            <div className="w-full">
                <Footerbar />
            </div>
        </div>
    );
};

export default TheaterPage;