import React, { useState, useEffect } from "react";
import "./responsive.css";
import movieData from "./test.json"
import Data from "./test2.json";
import logo from "./MinorCineflexLogo.jpg"

const CinemaPage: React.FC = () => {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [prevScroll, setPrevScroll] = useState(0);
    const [isFooterVisible, setIsFooterVisible] = useState(true);
 
    const region_list = ["กรุงเทพและปริมณฑล","ภาคกลาง","ภาคเหนือ","ภาคใต้","ภาคตะวันออกเฉียงเหนือ","ภาคตะวันออก","ภาคตะวันตก"]
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > prevScroll) {
                setIsNavbarVisible(false);
            } else {
                setIsNavbarVisible(true);
            }
            setPrevScroll(currentScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [prevScroll]);

    const region = (name) => {
        const filteredData = {
            "Cinema_list": Data.Cinema_list.filter(cinema => cinema.region === name)
        };
        
        const n = Object.keys(filteredData["Cinema_list"]).length


        return <div id={name} key={name}>
            <div id="regionName">
                <p className="text-[#E7AB79] text-3xl p-4">{name}</p>
            </div>
            <div id="grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">
                {Array.from({length:n}).map((_,i) => (
                    <div key={i} id="cinema" className="flex bg-pink-700 bg-opacity-70 border-2 border-[#E7AB79] p-4 rounded-2xl gap-2">
                        <img src={logo} alt="" className="rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                        <div className= "flex flex-col">
                            <p className="p-1 text-[#E7AB79] text-xl">{filteredData['Cinema_list'][i]["name"]}</p>
                            <p className="p-1 text-[#E7AB79]">{filteredData['Cinema_list'][i]["location"]}</p>
                        </div>
                    </div>
                ))}
            
            
            </div>
        </div>
    }
   

    return (
        <div id="headerNav" className="min-h-screen bg-[#4C3A51] flex flex-col items-center">
            <header className={`bg-white text-black h-20 fixed top-0 w-full flex items-center justify-center shadow-md z-10 transition-transform duration-500 ${isNavbarVisible ? "translate-y-0" : "-translate-y-full"}`}>
                <nav className="container mx-auto text-center text-lg font-semibold ">
                    This is header Nav
                </nav>
            </header>
            <div id = "body" className="flex flex-col w-full justify-center">
                <div id="่easteregg" className="p-7 whitespace-nowrap justify-center text-[#4C3A51]">
                    Hello there :) you found me  
                </div>
                <div id="head" className="flex w-full overflow-x-auto whitespace-nowrap scrollbar-thin">
                    {region_list.map((regionname) => (
                        <p 
                            onClick={() => { 
                             document.getElementById(regionname)?.scrollIntoView({
                                 behavior: "smooth", 
                                 block: "start" 
                                })
                            }}
                            key={regionname} className="p-4 text-[#E7AB79]" >{regionname}</p>
                    ))}
                </div>
                {region_list.map((regionname) => (
                    region(regionname)
                ))}
                <div id="justAblocck" className="w-full h-20">
                </div>
            </div>
            <button onClick={() => setIsFooterVisible(!isFooterVisible)} className={`fixed right-5 bg-[#774360] hover:bg-[#FF9F00] text-white px-4 py-2 rounded-lg shadow-lg z-20 transition-all duration-500 ${isFooterVisible ? "bottom-24" : "bottom-5"}`}>
                {isFooterVisible ? "Hide" : "Show"}
            </button>
            <footer id="footerNav" className={`bg-[#B25068] text-white h-20 fixed bottom-0 w-full flex items-center justify-center transition-transform duration-500 ${isFooterVisible ? "translate-y-0" : "translate-y-full"}`}>
                <div className="container mx-auto text-center">
                    <div className="text-black text-3xl font-semibold flex translate-x-10">BUY TICKET</div>
                </div>
            </footer>
        </div>
    );
};

export default CinemaPage;
