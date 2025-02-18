import React, { useRef , useState , useEffect} from 'react';
import Data from '../test.json';
import { FaCircleChevronLeft } from "react-icons/fa6";

const testData = Data

const ShowMoviesHistory = (testData: typeof Data) => {
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
      const movie = testData.MinorCineflex.cinema_list[0].cinema_management.movie_list[hoverIndex];
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
    const orientation = UseOrientation();
    console.log(orientation)
    if(window.innerWidth > 1000){
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
      <div className={`max-w-full max-h-full flex ${window.innerWidth < 1000 ? 'overflow-x-auto':'overflow-x-hidden'} gap-4 custom-scrollbar pb-3 pr-6 snap-x snap-mandatory`}
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
                          src={movie.pic} 
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

const HomePage: React.FC = () => {
  return (
    <div className='bg-[#4C3A51] w-screen max-w-screen h-screen flex flex-col gap-10 overflow-y-auto pb-24'>
      <nav className='w-full h-20 bg-[#D9D9D9] fixed text-center font-semibold	text-xl  z-50'>For nav bar</nav>
      <div className={`pt-24 w-full flex ${window.innerWidth<500?"pl-3":"pl-16"} gap-10 font-semibold text-[#E7AB79] underline text-lg`}>
        <button>หน้าหลัก</button>
        <button>ภาพยนตร์</button>
        <button>โรงภาพยนตร์</button>
      </div>
      <div className='w-full flex flex-col gap-4'>
        <h1 className='text-3xl text-[#E7AB79] font-semibold pl-10'>ภาพยนตร์แนะนำ</h1>
        {ShowMoviesHistory(testData)}
      </div>
      <div className='w-full flex flex-col gap-4'>
        <h1 className='text-3xl text-[#E7AB79] font-semibold pl-10'>กำลังฉาย</h1>
        {ShowMoviesHistory(testData)}
      </div>
      <div className='w-full flex flex-col gap-4'>
        <h1 className='text-3xl text-[#E7AB79] font-semibold pl-10'>เร็วๆนี้</h1>
        {ShowMoviesHistory(testData)}
      </div>
      <nav className='w-full min-h-20 max-h-20 fixed absolute bottom-0 bg-[#D9D9D9] text-center font-semibold	text-xl  z-50'>For bottom nav bar</nav>
    </div>
  );
}

export default HomePage;