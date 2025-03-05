import React, { useRef, useState, useEffect } from "react";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router";
import Footerbar from "../component/footerbar/footerbar.tsx";
import Headerbar from "../component/header/headerbar.tsx";
import { useSearchParams } from "react-router-dom";

const ShowMovies: React.FC<{ allMovie: any; role: string; searchQuery: string; navigate: any; currentUser: any }> = ({ allMovie, role, searchQuery, navigate, currentUser }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 100);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 100);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [allMovie, filteredMovies]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setTimeout(checkScroll, 300);
    }
  };

  useEffect(() => {
    const filtered = searchQuery !== ""
      ? allMovie.movie_list.filter((movie: any) => movie.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : allMovie.movie_list.filter((movie: any) => movie.role?.toLowerCase() === role.toLowerCase());
    setFilteredMovies(filtered);
  }, [allMovie, role, searchQuery]);

  return (
    <div className={`flex max-w-full pr-6 pl-6 gap-6 ${searchQuery !== '' ? "mt-12" : "mt-0"}`}>
      <div
        className={`max-w-full max-h-full flex ${window.innerWidth < 1000 ? "overflow-x-auto" : "overflow-x-hidden"} gap-4 custom-scrollbar pr-6 snap-x snap-mandatory`}
        ref={scrollContainerRef}
      >
        {filteredMovies.map((movie, index) => (
          <div
            key={index}
            className="max-h-fit h-100 w-72 flex-shrink-0 rounded-2xl"
            onClick={() =>
              navigate(`/Cinema/${movie.name}`, {
                state: {
                  account_id: currentUser?.account?.account_id,
                  movie_id: movie.movie_id,
                },
              })
            }
          >
            <div
              className="w-full h-4/5 overflow-hidden rounded-2xl hover:z-10 hover:border hover:border-black snap-start"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="relative w-full h-full">
                {hoverIndex === index && (
                  <div className="text-white absolute top-10 z-10 left-5 flex flex-col gap-6">
                    <p>Name: {movie.name}</p>
                    <p>Type: {movie.type}</p>
                    <p>Duration: {movie.duration}</p>
                  </div>
                )}
                <img
                  src={movie.img}
                  alt="Movie poster"
                  className={
                    hoverIndex === index
                      ? "min-h-full max-h-full w-full object-cover cursor-pointer z-10 blur-md brightness-50 duration-300 "
                      : "min-h-full max-h-full w-full object-cover cursor-pointer"
                  }
                />
              </div>
            </div>
            <h1 className="text-start text-white text-xl mt-2 font-semibold truncate text-[#D9D9D9]">{movie.name}</h1>
          </div>
        ))}
      </div>
      {window.innerWidth > 1000 && (
        <div className="w-fit min-h-full flex flex-col justify-center items-center gap-16">
          <button onClick={() => scroll("right")} className={`rotate-180 rounded-2xl ${!canScrollRight && !canScrollLeft ? 'opacity-0' : !canScrollRight ? 'opacity-25' : ''}`} disabled={!canScrollRight}>
            <FaCircleChevronLeft size={40} className="text-[#E7AB79]" />
          </button>
          <button onClick={() => scroll("left")} className={`rounded-2xl  ${!canScrollRight && !canScrollLeft ? 'opacity-0' : !canScrollLeft ? 'opacity-25' : ''}`} disabled={!canScrollLeft}>
            <FaCircleChevronLeft size={40} className="text-[#E7AB79]" />
          </button>
        </div>
      )}
    </div>
  );
};

const HomePage: React.FC = () => {
  const [allMovie, setAllMovie] = useState({ movie_list: [] });
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  let user_account_id = searchParams.get("account_id") || "";
  const searchQuery = searchParams.get("search") || "";
  const [currentUser, setCurrentUser] = useState<any>(null);

  //use params for prevent state data gone
  useEffect(() => {
    if (user_account_id) {
      setSearchParams(prev => ({ ...Object.fromEntries(prev), account_id: user_account_id }));
    }
  }, [user_account_id, setSearchParams]);

  useEffect(() => {
    if (state) {
      user_account_id = state?.account_id;
    }
  }, [state]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/minorcineflex/person/email/${user_account_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          console.log("Failed to fetch person_list");
          return;
        }
        const person = await response.json();
        setCurrentUser(person);
        console.log(person.account.username);
      } catch (error) {
        console.log("Error fetching user");
      }
    };
    user_account_id ? fetchUser() : console.log("Guest");
  }, [user_account_id]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8000/minorcineflex/movie", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          console.log("Error fetching movie_list");
          return;
        }

        const movieJson = await response.json();
        setAllMovie(movieJson);
      } catch (error) {
        console.error("Cannot fetch movie_list:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="bg-[#4C3A51] w-screen max-w-screen h-screen flex flex-col overflow-y-auto">
      <Headerbar userAccountId={currentUser?.account?.account_id} />
      {searchQuery === "" ? ["recommend", "on showing"].map((role) => (
        <div key={role} className="w-full flex flex-col gap-4 pt-8">
          <h2 className="text-3xl text-[#E7AB79] font-semibold pl-10">
            {role === "recommend" ? "ภาพยนตร์แนะนำ" : "กำลังฉาย"}
          </h2>
          <ShowMovies allMovie={allMovie} role={role} searchQuery={searchQuery} navigate={navigate} currentUser={currentUser} />
        </div>
      )) : (
        <ShowMovies allMovie={allMovie} role="" searchQuery={searchQuery} navigate={navigate} currentUser={currentUser} />
      )}
      <Footerbar />
    </div>
  );
};

export default HomePage;