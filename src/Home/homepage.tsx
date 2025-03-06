import React, { useRef , useState , useEffect} from 'react';

import { FaCircleChevronLeft } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router";

const HomePage: React.FC = () => {
  const [allMovie, setAllmovie] = useState({ movie_list: [] })
  const navigate = useNavigate()

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
  
    const ShowInfo = () =>{
      if(hoverIndex !== null){
        const movie = filteredMovies[hoverIndex];
        return(
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

    const filteredMovies = allMovie.movie_list.filter(movie => movie.role === role);
  
    return(
      <div className='flex max-w-full pr-6 pl-6 gap-6'>
        <div className={`max-w-full max-h-full flex ${window.innerWidth < 1000 ? 'overflow-x-auto':'overflow-x-hidden'} gap-4 custom-scrollbar pr-6 snap-x snap-mandatory`}
             ref={scrollContainerRef}
            >
            {filteredMovies.map((movie, index) => (
                <div  key={index} 
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
                            className={hoverIndex === index? "min-h-full max-h-full w-full object-cover cursor-pointer z-10 blur-md brightness-50 duration-300 "
                                                             : "min-h-full max-h-full w-full object-cover cursor-pointer"}
                        />
                      </div>
                  </div>
                  <h1 className="text-start text-white text-xl mt-2 font-semibold truncate text-[#D9D9D9]">{movie.name}</h1>
                </div>
            ))}
        </div>
        {showScrollButton()}
      </div>
    )
  }

  const { state }  = useLocation();
  const user_account_id = state
  const [currentUser, setCurrentUser] = useState(null)
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
        setCurrentUser(foundUser)
        console.log(foundUser.account.username)
      } catch (error) {
        console.log("Error to fetch user")
      }
    };
    user_account_id ? searchUser() : console.log("Guest")
  }, [allMovie, user_account_id])
 
  useEffect(() => {
    const fetchMovies = async() => {
      try{
        const movie_response = await fetch("http://localhost:8000/minorcineflex/movie", {
          method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if(!movie_response){
          console.log("Error to fetch movie_list")
          return
        }

        const movie_json = await movie_response.json()
        setAllmovie(movie_json)
      }catch(error){
        console.error("Can not fetch movie_list:", error)
      }
    }
    fetchMovies();
  }, [])

  const handleNavigate = (path) => {
    if(currentUser !== null){
      const account_id = currentUser.account.account_id
      navigate(path, {state: account_id})
      return
    }
    navigate(path)
  }

  return (
    <div className='bg-[#4C3A51] w-screen max-w-screen h-screen flex flex-col overflow-y-auto pb-24'>
      <nav className='w-full h-20 bg-[#D9D9D9] fixed text-center font-semibold	text-xl  z-50'>For nav bar</nav>
      <div className={`pt-24 w-full flex mb-10 ${window.innerWidth<500?"pl-3":"pl-16"} gap-10 font-semibold text-[#E7AB79] underline text-lg`}>
        <button onClick={() => handleNavigate("/")} className='hover:text-[#D4A373] hover:decoration-[#D4A373]'>หน้าหลัก</button>
        <button onClick={() => handleNavigate("/Movie")} className='hover:text-[#D4A373] hover:decoration-[#D4A373]'>ภาพยนตร์</button>
        <button onClick={() => handleNavigate("/Theater")} className='hover:text-[#D4A373] hover:decoration-[#D4A373]'>โรงภาพยนตร์</button>
      </div>
      <div className='w-full flex flex-col gap-4'>
        <h1 className='text-3xl text-[#E7AB79] font-semibold pl-10'>ภาพยนตร์แนะนำ</h1>
        {ShowMovies(allMovie, "recommend")}
      </div>
      <div className='w-full flex flex-col gap-4'>
        <h1 className='text-3xl text-[#E7AB79] font-semibold pl-10'>กำลังฉาย</h1>
        {ShowMovies(allMovie, "on showing")}
      </div>
      <div className='w-full flex flex-col gap-4'>
        <h1 className='text-3xl text-[#E7AB79] font-semibold pl-10'>เร็วๆนี้</h1>
        {ShowMovies(allMovie, "comming soon")}
      </div>
      <nav className='w-full min-h-20 max-h-20 fixed absolute bottom-0 bg-[#D9D9D9] text-center font-semibold	text-xl  z-50'>For bottom nav bar</nav>
    </div>
  );
}

export default HomePage;