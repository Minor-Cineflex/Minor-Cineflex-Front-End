import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSearchParams } from "react-router-dom";

export default function Footerbar() {
  const [allMovie, setAllMovie] = useState([]);
  const [allCinema, setAllCinema] = useState([]);
  const { state } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Retrieve account ID from URL params
  let user_account_id = searchParams.get("account_id") || "";
  const [currentUser, setCurrentUser] = useState(null);

  // Track selected movie and cinema
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");

  // Persist account ID in URL params
  useEffect(() => {
    if (user_account_id) {
      setSearchParams(prev => ({ ...Object.fromEntries(prev), account_id: user_account_id }));
    }
  }, [user_account_id, setSearchParams]);

  // Fetch user data
  useEffect(() => {
    if (user_account_id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:8000/minorcineflex/person/email/${user_account_id}`);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const person = await response.json();
          setCurrentUser(person);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUser();
    } else {
      console.log("Guest");
    }
  }, [user_account_id]);

  // Fetch movies and cinemas
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8000/minorcineflex/movie");
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        if (Array.isArray(data.movie_list)) setAllMovie(data.movie_list);
      } catch (error) {
        console.error("Cannot fetch movie list:", error);
      }
    };

    const fetchCinemas = async () => {
      try {
        const response = await fetch("http://localhost:8000/minorcineflex/cinema");
        if (!response.ok) throw new Error("Failed to fetch cinemas");
        const data = await response.json();
        if (Array.isArray(data.Cinema_list)) setAllCinema(data.Cinema_list);
      } catch (error) {
        console.error("Cannot fetch cinema list:", error);
      }
    };

    fetchMovies();
    fetchCinemas();
  }, []);

  // Filter only movies that are currently showing
  const filteredMovies = allMovie.filter(movie => movie.role === "on showing");

  // Handle buy button click
  const handleBuyClick = () => {
    if (!selectedMovie || !selectedCinema) {
      alert("Please select a movie and a theater.");
      return;
    }
    console.log({
      state: {
        account_id: currentUser?.account?.account_id,
        movie_id: selectedMovie,
        cinema_id: selectedCinema,
      },
    });

    navigate(`/Theater/${selectedMovie}/${selectedCinema}`, {
      state: {
        account_id: currentUser?.account?.account_id,
        movie_id: selectedMovie,
        cinema_id: selectedCinema,
      },
    });
  };

  return (
    <footer>
      <div className="p-4"></div>
      <div className="w-full p-4 md:px-16 md:text-xl text-bt-main font-black bg-bt-sec justify-between absolute bottom-0 flex md:flex-row flex-col uppercase gap-3 z-50">
        <span className="flex gap-4 items-center">
          <span className="flex gap-4 items-center">
            <p className="md:block hidden w-full">Buy Ticket</p>
            <div className="md:block hidden">|</div>
            <select
              className="bg-bg-main border border-bt-main text-bt-main text-sm rounded-lg block py-1 px-2.5 w-full md:min-w-48"
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
            >
              <option value="">Choose Movie</option>
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <option key={movie.movie_id} value={movie.movie_id}>
                    {movie.name}
                  </option>
                ))
              ) : (
                <option disabled>No movies available</option>
              )}
            </select>
          </span>

          <span className="flex gap-4 items-center">
            at
            <select
              className="bg-bg-main border border-bt-main text-bt-main text-sm rounded-lg block py-1 px-2.5 w-full md:min-w-48"
              value={selectedCinema}
              onChange={(e) => setSelectedCinema(e.target.value)}
            >
              <option value="">Theater</option>
              {allCinema.length > 0 ? (
                allCinema.map((cinema) => (
                  <option key={cinema.cinema_id} value={cinema.cinema_id}>
                    {cinema.name}
                  </option>
                ))
              ) : (
                <option disabled>No theaters available</option>
              )}
            </select>
          </span>
        </span>

        <button
          onClick={handleBuyClick}
          className="bg-bt-main text-bg-main rounded-lg p-2 w-full md:w-48"
        >
          BUY
        </button>
      </div>
    </footer>
  );
}