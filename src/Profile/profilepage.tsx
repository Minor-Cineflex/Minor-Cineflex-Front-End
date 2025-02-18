import React, { useRef, useState } from "react";
import Logo from "./logo/MinorCineflexLogo.jpg"
import Data from "../test.json"
import { FaCircleChevronLeft } from "react-icons/fa6";

const testData = Data

function ShowMoviesHistory(){
    const [hoverIndex, setHoverIndex] = useState(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
          const scrollAmount = 300;
          scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
          });
        }
      };
    return(
        <div className='flex max-w-full pr-6 pl-6 gap-6'>
            <div className="max-w-full max-h-full flex overflow-x-hidden gap-4 custom-scrollbar pb-3 pr-6 snap-x snap-mandatory"
                 ref={scrollContainerRef}
            >
                {testData.MinorCineflex.cinema_list[0].cinema_management.movie_list.map((movie, index) => (
                   <div  key={index} 
                         className="h-100 w-56 flex-shrink-0 rounded-2xl"
                    >
                        <div className='w-full h-80 overflow-hidden rounded-2xl hover:z-10 hover:border hover:border-black snap-start'
                        onMouseEnter={() => setHoverIndex(index)}
                        >
                            <img 
                                className="h-full w-full object-cover cursor-pointer hover:z-10 hover:blur-md hover:brightness-50 hover:duration-300" 
                                src={movie.pic} 
                                alt="Movie poster"
                            />
                        </div>
                    <h1 className="text-start text-white text-lg mt-2 font-semibold truncate text-[#D9D9D9]">{movie.name}</h1>
                </div>
                ))}
            </div>
            <div className='w-fit min-h-full flex flex-col justify-center items-center gap-16'>
                <button onClick={() => scroll('right')} className='rotate-180'><FaCircleChevronLeft size={40}/></button>
                <button  onClick={() => scroll('left')} className=''><FaCircleChevronLeft size={40}/></button>
            </div>
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
                <h1 className="text-2xl font-semibold text-white pl-12">
                    History
                </h1>
                <div className="h-86 w-full mb-3">
                   <ShowMoviesHistory />
                </div>
            </div>
        </div>
    )
}

export default ProfilePage