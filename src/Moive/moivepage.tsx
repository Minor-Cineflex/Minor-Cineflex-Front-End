import React, { useRef, useState, useEffect } from "react";
import { FaCircleChevronLeft } from "react-icons/fa6";
import Footerbar from "../component/footerbar/footerbar.tsx";
import Headerbar from "../component/header/headerbar.tsx";
import { useLocation } from "react-router";



const MoviePage: React.FC = () => {
  const [allMovie, setAllMovie] = useState({ movie_list: [] })
  const [currentUser, setCurrentUser] = useState(null)
  const { state } = useLocation()
  const account_id = state?.account_id

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8000/minorcineflex/movie");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Ensure we correctly access the movie_list array
        if (data.movie_list && Array.isArray(data.movie_list)) {
          setAllMovie({ movie_list: data.movie_list }
          );

        } else {
          console.error("Unexpected movie data format:", data);
        }
      } catch (error) {
        console.error("Cannot fetch movie list:", error);
      }
    }
    fetchMovies();

  }, []);

  useEffect(() => {
    const searchUser = async () => {
        if (!account_id) {
            console.log("Guest");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/minorcineflex/person/email/${account_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
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

    searchUser();
  }, [state, account_id]);
  const ShowMovies = (allMovie: any, role: string) => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 100);
        setCanScrollRight((scrollLeft + clientWidth) < (scrollWidth - 100));
      }
    };

    useEffect(() => {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }, [allMovie]);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollContainerRef.current) {
        const scrollAmount = 350;
        scrollContainerRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });

        setTimeout(checkScroll, 300);
      }
    };

    const ShowInfo = () => {
      if (hoverIndex !== null) {
        const movie = filteredMovies[hoverIndex];
        return (
          <div className='text-white absolute top-10 z-10 left-5 flex flex-col gap-6'>
            <p>Name: {movie.name}</p>
            <p>Type: {movie.type}</p>
            <p>Duration: {movie.duration}</p>
          </div>
        )
      }
    }

    const UseOrientation = () => {
      const getOrientation = () => (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');

      const [orientation, setOrientation] = useState(getOrientation);

      useEffect(() => {
        const handleResize = () => setOrientation(getOrientation);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      return orientation;
    };

    const showScrollButton = () => {
      UseOrientation();
      if (window.innerWidth > 1000) {
        return (
          <div className='w-fit min-h-full flex flex-col justify-center items-center gap-16'>
            <button
              onClick={() => scroll('right')}
              className={`rotate-180 rounded-2xl ${!canScrollRight && !canScrollLeft ? 'opacity-0' : !canScrollRight ? 'opacity-25' : ''}`}
              disabled={!canScrollRight}
            >
              <FaCircleChevronLeft size={40} className='text-[#E7AB79]' />
            </button>
            <button
              onClick={() => scroll('left')}
              className={`rounded-2xl ${!canScrollRight && !canScrollLeft ? 'opacity-0' : !canScrollLeft ? 'opacity-25' : ''}`}
              disabled={!canScrollLeft}
            >
              <FaCircleChevronLeft size={40} className='text-[#E7AB79]' />
            </button>
          </div>
        )
      }
    }

    const filteredMovies = allMovie.movie_list.filter(movie => movie.role === role);

    return (
      <div className='flex max-w-full pr-6 pl-6 gap-6'>
        <div className={`max-w-full max-h-full flex ${window.innerWidth < 1000 ? 'overflow-x-auto' : 'overflow-x-hidden'} gap-4 custom-scrollbar pr-6 snap-x snap-mandatory`}
          ref={scrollContainerRef}
        >
          {filteredMovies.map((movie, index) => (
            <div key={index}
              className="max-h-fit h-100 w-72 flex-shrink-0 rounded-2xl"
            >
              <div className='w-full h-4/5 overflow-hidden rounded-2xl hover:z-10 hover:border hover:border-black snap-start'
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className='relative w-full h-full'>
                  {hoverIndex === index && ShowInfo()}
                  <img
                    src={movie.img}
                    alt="Movie poster"
                    className={hoverIndex === index ? "min-h-full max-h-full w-full object-cover cursor-pointer z-10 blur-md brightness-50 duration-300 "
                      : "min-h-full max-h-full w-full object-cover cursor-pointer"}
                  />
                </div>
              </div>
              <h1 className="text-start text-white text-xl mt-2 font-semibold truncate">{movie.name}</h1>
            </div>
          ))}
        </div>
        {showScrollButton()}
      </div>
    )
  }



  return (
    <div className="bg-[#4C3A51] w-screen max-w-screen h-screen flex flex-col gap-10 overflow-y-auto">
      <Headerbar userAccountId={currentUser?.account.account_id} />

      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-[#E7AB79] font-semibold pl-10">ภาพยนตร์แนะนำ</h1>
        {ShowMovies(allMovie, "recommend")}
      </div>
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-[#E7AB79] font-semibold pl-10">กำลังฉาย</h1>
        {ShowMovies(allMovie, "on showing")}
      </div>

      <Footerbar />
    </div>
  );
};

export default MoviePage;