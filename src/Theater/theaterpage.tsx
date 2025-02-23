import React, { useState, useEffect } from "react";
import "./responsive.css";

let list_day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TheaterPage: React.FC = () => {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isFooterVisible, setIsFooterVisible] = useState(true);
    const [prevScroll, setPrevScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > prevScroll) {
                setIsNavbarVisible(false);
                setIsFooterVisible(false); // เลื่อนลง -> ซ่อน Footer
            } else {
                setIsNavbarVisible(true);
                setIsFooterVisible(true);  // เลื่อนขึ้น -> แสดง Footer
            }
            setPrevScroll(currentScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [prevScroll]);

    return (
        <div id="headerNav" className="min-h-screen bg-[#4C3A51] flex flex-col items-center">
            <header className={`bg-white text-black h-20 fixed top-0 w-full flex items-center justify-center shadow-md z-10 transition-transform duration-500 ${isNavbarVisible ? "translate-y-0" : "-translate-y-full"}`}>
                <nav className="container mx-auto text-center text-lg font-semibold">
                    This is header Nav
                </nav>
            </header>
            <section id="chooseDay" className="mt-24 w-full px-4 flex flex-wrap items-start gap-2 pl-4">
                <div id="Today" className="border-2 border-orange-300 p-2 shadow-lg rounded-2xl bg-[#B25068] w-full md:w-auto text-center">
                    <p className="text-yellow-400 text-2xl p-1">{list_day[0]}</p>
                </div>
                <div id="schedule" className="flex flex-wrap justify-center gap-2 border-2 border-orange-300 p-2 shadow-lg rounded-2xl">
                    {list_day.slice(1).map((day, index) => (
                        <div key={index} className="border-2 border-orange-300 p-2 shadow-lg rounded-2xl bg-[#B25068] text-center">
                            <p className="text-yellow-400 text-lg">{day}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section id="showtime" className="mt-8 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4 justify-items-center">
                {Array.from({ length: 24 }).map((_, index) => (
                    <div key={index} className="w-72 h-32 bg-[#774360] border-2 border-orange-300 shadow-lg rounded-2xl flex items-center justify-center mb-20">
                        <p className="text-yellow-400 text-xl">Showtime {index + 1}</p>
                    </div>
                ))}
            </section>
            <footer id="footerNav" className={`bg-[#B25068] text-white h-20 fixed bottom-0 w-full flex items-center justify-center transition-transform duration-500 ${isFooterVisible ? "translate-y-0" : "translate-y-full"}`}>
                <div className="container mx-auto text-center">
                    <div className="text-black text-3xl font-semibold flex translate-x-10">BUY TICKET</div>
                </div>
            </footer>
        </div>
    );
}

export default TheaterPage;