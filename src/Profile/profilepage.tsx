import React, { useRef, useState , useEffect } from "react";
import Logo from "./logo/MinorCineflexLogo.jpg"
import Data from "../test.json"
import { FaCircleChevronLeft } from "react-icons/fa6";

const testData = Data

const ShowMoviesHistory = () => {
    const [hoverIndex, setHoverIndex] = useState(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          setCanScrollLeft(scrollLeft > 0); 
          setCanScrollRight(scrollLeft + clientWidth < scrollWidth); 
        }
      };
    
      useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
      }, []);

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
          return(
            <div className='text-white absolute top-10 z-10 left-5 flex flex-col gap-6'>
               <p>Name: {testData.MinorCineflex.cinema_list[0].cinema_management.movie_list[hoverIndex].name}</p>
               <p>Type: {testData.MinorCineflex.cinema_list[0].cinema_management.movie_list[hoverIndex].type}</p>
               <p>Duration: {testData.MinorCineflex.cinema_list[0].cinema_management.movie_list[hoverIndex].duration}</p>
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
        const orientation = UseOrientation();
        console.log(orientation)
        if(window.innerWidth > 500){
            return(
                <div className='w-fit min-h-full flex flex-col justify-center items-center gap-16'>
                    <button 
                        onClick={() => scroll('right')} 
                        className={`rotate-180 rounded-2xl ${!canScrollRight ? 'opacity-25' : ''}`}
                        disabled={!canScrollRight}
                    >
                        <FaCircleChevronLeft size={40} className='text-[#E7AB79]'/>
                    </button>
                    <button  
                        onClick={() => scroll('left')} 
                        className={`rounded-2xl ${!canScrollLeft ? 'opacity-25' : ''}`}
                        disabled={!canScrollLeft}
                    >
                        <FaCircleChevronLeft size={40} className='text-[#E7AB79]'/>
                    </button>
                </div>
            )
        }
    }

    return(
        <div className='flex max-w-full pr-6 pl-6 gap-6'>
            <div className={`max-w-full max-h-full flex ${window.innerWidth < 500 ? 'overflow-x-auto':'overflow-x-hidden'} gap-4 custom-scrollbar pb-3 pr-6 snap-x snap-mandatory`}
                 ref={scrollContainerRef}
            >
                {testData.MinorCineflex.cinema_list[0].cinema_management.movie_list.map((movie, index) => (
                   <div  key={index} 
                         className="h-100 w-72 flex-shrink-0 rounded-2xl"
                    >
                        <div className='w-full h-4/5 overflow-hidden rounded-2xl hover:z-10 hover:border hover:border-black snap-start'
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        >
                            <div className='relative w-full h-full'>
                                {hoverIndex === index && ShowInfo()}
                                <img 
                                    className={hoverIndex === index? "min-h-full max-h-full w-full object-cover cursor-pointer z-10 blur-md brightness-50 duration-300 "
                                                                     : "min-h-full max-h-full w-full object-cover cursor-pointer"} 
                                    src={movie.pic} 
                                    alt="Movie poster"
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

const ProfilePage: React.FC = () => {
    return(
        <div className="min-w-full min-h-screen bg-[#4C3A51] flex flex-col justify-evenly overflow-hidden">
            <div className="min-w-fit w-2/5 min-h-fit bg-[#D9D9D9] flex flex-col justify-items-center items-center self-center mt-8 gap-6 rounded-2xl">
                <img src={Logo} alt="" className="size-28"/>
                <div className="flex flex-col w-full max-w-80 self-start items-center gap-6 mb-12 pl-6 pr-6">
                    <h1 className="text-xl w-full font-semibold truncate ...">Username: </h1>
                    <h1 className="text-xl w-full font-semibold truncate ...">Email: </h1> 
                </div>
            </div>
            <div className="min-h-fit w-screen flex flex-col justify-center mt-12 gap-3">
                <h1 className="text-3xl font-semibold text-[#E7AB79] pl-12">
                    History
                </h1>
                <div className="h-86 w-full mb-3">
                   {ShowMoviesHistory()}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage