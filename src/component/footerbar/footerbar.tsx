import React, { useEffect, useState } from "react";

export default function Footerbar() {
  const [allMovie, setAllMovie] = useState([]);
  const [allCinema, setAllCinema] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://0.0.0.0:8000/minorcineflex/movie");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Ensure we correctly access the movie_list array
        if (data.movie_list && Array.isArray(data.movie_list)) {
          setAllMovie(data.movie_list);
        } else {
          console.error("Unexpected movie data format:", data);
        }
      } catch (error) {
        console.error("Cannot fetch movie list:", error);
      }
    };

    const fetchCinema = async () => {
      try {
        const response = await fetch("http://0.0.0.0:8000/minorcineflex/cinema");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setAllCinema(data);
        } else {
          console.error("Unexpected cinema data format:", data);
        }
      } catch (error) {
        console.error("Cannot fetch cinema list:", error);
      }
    };

    fetchMovies();
    fetchCinema();
  }, []);

  const filteredMovies = allMovie.filter(movie => movie.role === "on showing");

  return (
    <footer>
      <div className="p-4"></div>
      <div className="w-full p-4 xl:px-16 xl:text-xl text-bt-main font-black bg-bt-sec absolute bottom-0 flex xl:flex-row flex-col uppercase gap-3 z-50">
        <span className="flex gap-4 items-center">
          <p className="xl:block hidden w-full">Buy Ticket</p> <div className="xl:block hidden">|</div>
          <select className="bg-bg-main border border-bt-main text-bt-main text-sm rounded-lg block py-1 px-2.5 w-full xl:min-w-48">
            <option value="">Choose Movie</option>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <option key={movie.movie_id} value={movie.name}>{movie.name}</option>
              ))
            ) : (
              <option disabled>No movies available</option>
            )}
          </select>
        </span>
        <span className="flex gap-4 items-center">
          at
          <select className="bg-bg-main border border-bt-main text-bt-main text-sm rounded-lg block py-1 px-2.5 w-full xl:min-w-48">
            <option value="">Theater</option>
            {allCinema.length > 0 ? (
              allCinema.map((cinema) => (
                <option key={cinema.cinema_id} value={cinema.name}>{cinema.name}</option>
              ))
            ) : (
              <option disabled>No theaters available</option>
            )}
          </select>
        </span>
      </div>
    </footer>
  );
}