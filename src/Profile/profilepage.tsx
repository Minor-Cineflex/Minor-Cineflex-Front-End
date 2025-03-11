import React, { useRef, useState , useEffect } from "react";
import Logo from "../Logo/MinorCineflexLogo.jpg"
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router";

const ProfilePage: React.FC = () => {

const [allMovieAndSeat, setAllMovieAndSeat] = useState({ movie_list: [], seat_list: [] })
const [history, setHistory] = useState(null)

const ShowMovies = (allMovieAndSeat) => {
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
    }, [allMovieAndSeat]);
  
    const scroll = (direction: 'left' | 'right') => {
      if (scrollContainerRef.current) {
        const scrollAmount = 300;
        scrollContainerRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth',
        });
  
        setTimeout(checkScroll, 300);
      }
    };
  
    const ShowInfo = () =>{
      if(hoverIndex !== null){
        const movie = allMovieAndSeat.movie_list[hoverIndex];
        const seat = allMovieAndSeat.seat_list[hoverIndex];
        const totalSeatPrice = allMovieAndSeat.seat_list[hoverIndex].reduce((sum, seat) => sum + seat.price, 0);
        return(
          <div className='text-white absolute top-6 z-10 left-5 flex flex-col gap-2'>
            <p>Name: {movie.name}</p>
            <p>Type: {movie.type}</p>
            <p>Duration: {movie.duration}</p>
            <div>
              <p>Seats:</p>
              <ul className="pl-6 max-h-24 overflow-y-auto custom-profile-scrollbar pr-6">
                {seat.map((s, index) => (
                  <li key={index}>{s.seat_pos} {s.seat_type} {s.price} baht</li>
                ))}
              </ul>
            </div>
            <p>Total: {totalSeatPrice} baht</p>
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
      if(window.innerWidth > 1000){
        return(
          <div className='w-fit min-h-full flex flex-col justify-center items-center gap-16'>
            <button 
              onClick={() => scroll('right')} 
              className={`rotate-180 rounded-2xl ${!canScrollRight && !canScrollLeft ? 'opacity-0' : !canScrollRight ? 'opacity-25' : ''}`}
              disabled={!canScrollRight}
            >
              <FaCircleChevronLeft size={40} className='text-[#E7AB79]'/>
            </button>
            <button  
              onClick={() => scroll('left')} 
              className={`rounded-2xl ${!canScrollRight && !canScrollLeft ? 'opacity-0' : !canScrollLeft ? 'opacity-25' : ''}`}
              disabled={!canScrollLeft}
            >
              <FaCircleChevronLeft size={40} className='text-[#E7AB79]'/>
            </button>
          </div>
        )
      }
    }

    const renderMovies = () => {
      try {
        return (
          allMovieAndSeat.movie_list.map((movie, index) => (
            <div  key={index} 
                className="h-96 w-64 flex-shrink-0 rounded-2xl"
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
                        className={hoverIndex === index? "min-h-full max-h-full w-full object-cover cursor-pointer z-10 blur-md brightness-50 duration-300 "
                                                        : "min-h-full max-h-full w-full object-cover cursor-pointer"}
                    />
                  </div>
              </div>
              <h1 className="text-start text-white text-xl mt-2 font-semibold truncate text-[#D9D9D9]">{movie.name}</h1>
            </div>
          ))
        )
      } catch (error) {
          return;
      }
  };

    return(
      <div className='flex max-w-full pr-6 pl-6 gap-6'>
        <div className={`max-w-full max-h-full flex ${window.innerWidth < 1000 ? 'overflow-x-auto':'overflow-x-hidden'} gap-4 custom-scrollbar pb-3 pr-6 snap-x snap-mandatory`}
             ref={scrollContainerRef}
            >
            {renderMovies()}
        </div>
        {showScrollButton()}
      </div>
    )
  }

    const navigate = useNavigate()
    const { state }  = useLocation();
    const [currentUser, setCurrentUser] = useState<any>(null)
    const user_account_id = state?.account_id
    
    useEffect(() => {
      const searchUser = async () => {
          try {
              const response = await fetch(`http://localhost:8000/minorcineflex/person/email/${user_account_id}`, {
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
              const foundUser = person;
              if (foundUser) {
                setCurrentUser(foundUser);
                return
              } else {
                navigate('/Login');
                return
              }
          } catch (error) {
              console.error("Cannot fetch person:", error);
          }
      };

      searchUser();
    }, [user_account_id, navigate]);

    useEffect(() => {
        if (currentUser) {
            setHistory(currentUser.account.history);
        }
    }, [currentUser]);

    useEffect(() => {
      const fetchHistoryMovies = async () => {
        if (!history) return;
    
        try {
          const movieAndSeatData = await Promise.all(
            history.map(async (entry) => {
              try {
                const showtimeResponse = await fetch(
                  `http://localhost:8000/minorcineflex/cinema/${entry.showtime.cinema_id}/showtime/${entry.showtime.showtime_id}`
                );
    
                if (!showtimeResponse.ok) {
                  console.error("Failed to fetch showtime:", entry.showtime.showtime_id);
                  return null;
                }
    
                const showtimeData = await showtimeResponse.json();
                const movie_id = showtimeData.movie_id;
    
                const movieResponse = await fetch(
                  `http://localhost:8000/minorcineflex/movie/${movie_id}`
                );
    
                if (!movieResponse.ok) {
                  console.error("Failed to fetch movie:", movie_id);
                  return null;
                }
    
                const movieData = await movieResponse.json();

                const uniqueSeatIds = [...new Set(entry.seat_list.map(seat => seat.seat_id))];
                const seatPromises = uniqueSeatIds.map(async (seat_id) => {
                  const seatResponse = await fetch(
                    `http://localhost:8000/minorcineflex/SeatInfo/${entry.showtime.showtime_id}/${seat_id}`
                  );
                
                  if (!seatResponse.ok) {
                    console.error("Failed to fetch seat info:", seat_id);
                    return null;
                  }
                
                  const seatData = await seatResponse.json();
                  
                  return seatData;
                });      
                const seatData = await Promise.all(seatPromises);
    
                return {
                  movie: movieData,
                  seats: seatData
                };
              } catch (error) {
                console.error("Error processing entry:", entry, error);
                return null;
              }
            })
          );

          const validData = movieAndSeatData.filter((data) => data !== null);
    
          setAllMovieAndSeat({
            movie_list: validData.map((data) => data.movie),
            seat_list: validData.map((data) => data.seats),
          });
        } catch (error) {
          console.error("Error fetching history movies:", error);
        }
      };
    
      fetchHistoryMovies();
    }, [history]);
    
    const showUsername = () => {
        if(currentUser){
            return currentUser.account.username
        }
    }

    const showEmail = () => {
        if(currentUser){
            return currentUser.email
        }
    }

    return(
        <div className="min-w-full min-h-screen bg-[#4C3A51] flex flex-col justify-evenly overflow-hidden">
            <nav onClick={() => navigate("/", {state: {account_id: currentUser.account.account_id}})}><FaChevronLeft className="cursor-pointer text-[#E7AB79] mt-4 ml-5" size={25}/></nav>
            <div className="min-w-fit w-2/5 min-h-fit bg-[#D9D9D9] flex flex-col justify-items-center items-center self-center mt-4 gap-4 rounded-2xl">
                <img src={Logo} alt="" className="size-28"/>
                <div className="flex flex-col w-full self-start items-center gap-4 mb-4 pl-6 pr-6">
                    <h1 className="text-xl w-full font-semibold flex gap-3">Username: 
                        <p className="truncate font-normal">{showUsername()}</p>
                    </h1>
                    <h1 className="text-xl w-full font-semibold truncate flex gap-3">Email: 
                        <p className="truncate font-normal">{showEmail()}</p>
                    </h1> 
                    <button 
                    className="self-end font-semibold text-lg hover:text-gray-600"
                    onClick={() => navigate("/")}
                    >
                      Log out
                    </button>
                </div>
            </div>
            <div className="min-h-fit w-screen flex flex-col justify-center mt-6 gap-3">
                <h1 className="text-3xl font-semibold text-[#E7AB79] pl-12">
                    History
                </h1>
                <div className="h-80 w-full mb-12">
                   {ShowMovies(allMovieAndSeat)}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage