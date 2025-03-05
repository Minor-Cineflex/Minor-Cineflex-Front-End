import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";

// Define interfaces to improve type safety
interface Movie {
    movie_id: string;
    name: string;
    img: string;
}

interface Theater {
    theater_id: string;
    audio_type: string;
    video_type: string;
}

interface Showtime {
    movie_id: string;
    theater_id: string;
    start_date: string;
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
                const response = await fetch('http://localhost:8000/minorcineflex/cinema/101/showtime', {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch showtime");
                const data = await response.json();
                setShowtimeList(data);
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
                const response = await fetch('http://localhost:8000/minorcineflex/cinema/101/theater', {
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

    const handleDayClick = (date: Date) => setSelectedDay(date);

    const formatDate = (date: Date) => date.toLocaleDateString();
    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
        // Find the movie name and image by matching movie_id
        const matchedMovie = movieList.find(movie => movie.movie_id === showtime.movie_id);
        const movieName = matchedMovie ? matchedMovie.name : 'Unknown Movie';
        const movieImg = matchedMovie ? matchedMovie.img : 'https://via.placeholder.com/200x300?text=No+Image';

        // Find the theater details
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
        groups[movieKey].times.push(new Date(showtime.start_date));
        return groups;
    }, {});

    return (
        <div className="min-h-screen bg-[#4C3A51] flex flex-col items-center">
            <header className={`bg-white text-black h-20 fixed top-0 w-full flex items-center justify-center shadow-md z-10 transition-transform duration-500 ${isNavbarVisible ? "translate-y-0" : "-translate-y-full"}`}>
                <nav className="text-lg font-semibold">This is header Nav</nav>
            </header>
            <section className="pb-4 mt-24 px-4">
                <div className="p-4 border-2 border-orange-300 shadow-lg rounded-2xl bg-[#B25068] text-center flex flex-col md:flex-row items-center gap-2">
                    <div className="flex items-center gap-3">
                        <p className="text-yellow-400 text-2xl">You choose: {formatDate(selectedDay)}</p>
                        <button
                            onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                            className="bg-[#774360] text-white p-2 rounded-lg"
                        >
                            {isCalendarVisible ? "Hide Calendar" : "Show Calendar"}
                        </button>
                    </div>
                    {isCalendarVisible && (
                        <div className="ml-auto">
                            <Calendar onChange={handleDayClick} value={selectedDay} />
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
                                    Theater ID: {theater ? theater.theater_id : 'Unknown'} |
                                    Audio Type: {theater ? theater.audio_type : 'Unknown'} |
                                    Video Type: {theater ? theater.video_type : 'Unknown'}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {times.map((time, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedShowtime(formatTime(time))}
                                            className="bg-[#774360] text-white p-2 rounded-lg"
                                        >
                                            {formatTime(time)}
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
            <footer className={`bg-[#B25068] text-white h-20 fixed bottom-0 w-full text-center transition-transform duration-500 ${isFooterVisible ? "translate-y-0" : "translate-y-full"}`}>
                <div>BUY TICKET</div>
            </footer>
            <button onClick={() => setIsFooterVisible(!isFooterVisible)} className="bg-[#774360] text-white p-2 rounded-lg fixed right-5 bottom-5">
                {isFooterVisible ? "Hide" : "Show"}
            </button>
        </div>
    );
};

export default TheaterPage;