import React, { useRef, useState } from "react";
import Data from "../test.json";
import { FaCircleChevronLeft } from "react-icons/fa6";
import Footerbar from "../component/footerbar/footerbar.tsx";
import Headerbar from "../component/header/headerbar.tsx";

const testData = Data;

function ShowMoviesHistory(testData: typeof Data) {
  const [hoverIndex, setHoverIndex] = useState(null);
  function ShowInfo() {
    console.log(hoverIndex);
    if (hoverIndex !== null) {
      return (
        <div className="text-white absolute top-10 z-10 left-5 flex flex-col gap-6">
          <p>
            Name:{" "}
            {
              testData.MinorCineflex.cinema_list[0].cinema_management
                .movie_list[hoverIndex].name
            }
          </p>
          <p>
            Type:{" "}
            {
              testData.MinorCineflex.cinema_list[0].cinema_management
                .movie_list[hoverIndex].type
            }
          </p>
          <p>
            Duration:{" "}
            {
              testData.MinorCineflex.cinema_list[0].cinema_management
                .movie_list[hoverIndex].duration
            }
          </p>
        </div>
      );
    }
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  var temp = hoverIndex
    ? "min-h-full max-h-full w-full object-cover cursor-pointer z-10 blur-md brightness-50 duration-300 "
    : "min-h-full max-h-full w-full object-cover cursor-pointer";
  return (
    <div className="flex max-w-full pr-6 pl-6 gap-6">
      <div
        className="max-w-full max-h-full flex overflow-x-hidden gap-4 custom-scrollbar pb-3 pr-6 snap-x snap-mandatory"
        ref={scrollContainerRef}
      >
        {testData.MinorCineflex.cinema_list[0].cinema_management.movie_list.map(
          (movie, index) => (
            <div
              key={index + 1}
              className="h-100 w-56 flex-shrink-0 rounded-2xl"
            >
              <div
                className="w-full h-80 overflow-hidden rounded-2xl hover:z-10 hover:border hover:border-black snap-start"
                onMouseEnter={() => setHoverIndex(index + 1)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="relative w-full h-full">
                  {hoverIndex !== null &&
                    hoverIndex === index + 1 &&
                    ShowInfo()}
                  <img
                    src={movie.pic}
                    alt="Movie poster"
                    className={
                      hoverIndex === index + 1
                        ? temp
                        : "min-h-full max-h-full w-full object-cover cursor-pointer"
                    }
                  />
                </div>
              </div>
              <h1 className="text-start text-white text-lg mt-2 font-semibold  truncate">
                {movie.name}
              </h1>
            </div>
          )
        )}
      </div>
      <div className="w-fit h-full flex flex-col justify-center items-center gap-16">
        <button
          onClick={() => scroll("right")}
          className="rotate-180 rounded-2xl"
        >
          <FaCircleChevronLeft size={40} className="text-[#E7AB79]" />
        </button>
        <button onClick={() => scroll("left")} className="rounded-2xl">
          <FaCircleChevronLeft size={40} className="text-[#E7AB79]" />
        </button>
      </div>
    </div>
  );
}

const MoivePage: React.FC = () => {
  return (
    <div className="bg-[#4C3A51] w-screen max-w-screen h-screen flex flex-col gap-10 overflow-y-auto">
      <Headerbar />

      <div className=" w-full flex flex-col gap-4">
        <h1 className="text-2xl text-[#E7AB79] font-semibold pl-10">
          ภาพยนตร์แนะนำ
        </h1>
        {ShowMoviesHistory(testData)}
      </div>
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl text-[#E7AB79] font-semibold pl-10">
          กำลังฉาย
        </h1>
        {ShowMoviesHistory(testData)}
      </div>
      <Footerbar />
    </div>
  );
};

export default MoivePage;
