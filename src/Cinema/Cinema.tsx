import React, { useState, useEffect,useRef } from "react";
import "./responsive.css";
import movieData from "./test.json"
import tmpData from "./test2.json";
import logo from "./MinorCineflexLogo.jpg"
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"

const region_list = ["กรุงเทพและปริมณฑล","ภาคกลาง","ภาคเหนือ","ภาคใต้","ภาคตะวันออกเฉียงเหนือ","ภาคตะวันออก","ภาคตะวันตก"];

const Region: React.FC = () => {
    const [cinemaList, setCinemaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};

    console.log(state)
    

    const click_cinema = (cinema_id) => {
        console.log(cinema_id)
        navigate("/Theater", { state: { ...state, cinema_id } });
    }

    useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const response = await fetch("http://localhost:8000/minorcineflex/cinema", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch cinema list");
                }

                const data = await response.json();
                
                setCinemaList(data.Cinema_list || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCinemas();
    }, []);

    if (loading) return <p>Loading cinemas...</p>;
    if (error) return <p>Error: {error}</p>;

    const each = (name) => {
        const filterdata = cinemaList.filter((cinema) => cinema["region"] === name);
        
        return (
            <div id={name} key={name}>
                <div id="regionName">
                    <p className="text-[#E7AB79] text-3xl p-4">{name}</p>
                </div>
                <div id="grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">
                    {filterdata.map((cinema,i) => (
                        <div key={i} id="cinema" onClick = {() => click_cinema(cinema["cinema_id"])}className="flex bg-pink-700 bg-opacity-70 border-2 border-[#E7AB79] p-4 rounded-2xl gap-2">
                            <img src={logo} alt="" className="rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                            <div className= "flex flex-col">
                                <p className="p-1 text-[#E7AB79] text-xl">{cinema["name"]}</p>
                                <p className="p-1 text-[#E7AB79]">{cinema["location"]}</p>
                            </div>
                        </div> 
                    ))}

                    
                </div>
            </div>
        )
    }

    return <div>
        {region_list.map((regionname) => each(regionname))}
    </div>;

}

const CinemaPage: React.FC = () => {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const prevScroll = useRef(0);
    const [isFooterVisible, setIsFooterVisible] = useState(true);
 
    
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            setIsNavbarVisible(currentScroll <= prevScroll.current);
            prevScroll.current = currentScroll; 
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

   
   

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
                             document.getElementById(regionname).scrollIntoView({
                                 behavior: "smooth", 
                                 block: "start" 
                                })
                            }}
                            key={regionname} className="p-4 text-[#E7AB79]" >{regionname}</p>
                    ))}
                </div>
                <Region/>
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
