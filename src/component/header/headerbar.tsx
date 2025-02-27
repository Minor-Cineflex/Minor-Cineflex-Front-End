import React, { useState } from "react";
import MinorCineflexLogo from "../MinorCineflexLogo.jpg";
import Data from "../../test.json";
import { FaUserCircle } from "react-icons/fa";

const testData = Data;

export default function Footerbar() {
    const [search, setSearch] = useState('');
    const filteredMovie = testData.MinorCineflex.cinema_list[0].cinema_management.movie_list.filter((moive) =>
        moive.name.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <>
            <nav className="w-full p-3 px-16 items-center text-3xl text-bt-main place-content-between font-semibold bg-bt-sec absolute spaceb flex uppercase gap-3 z-50 content-center">
                <span className="flex uppercase gap-3 content-center items-center cursor-pointer">
                    <img className="h-10" src={MinorCineflexLogo} alt="logo" />
                    Minor Cineflex
                </span>


                <span className="flex gap-3 items-center">
                    <form className="max-w-md w-64">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 text-bt-main "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full p-2 px-4 ps-4 text-sm text-bt-main border border-bt-main rounded-lg bg-bg-main relative"
                                placeholder="Search moive"
                                onChange={e => setSearch(e.target.value)}
                                required
                            />
                            {search !== "" && filteredMovie.length > 0 &&
                                <div className="absolute flex flex-col gap-3 text-base p-4 rounded-md mt-1 border border-bt-main  text-bt-main font-normal bg-bg-main normal-case">
                                    {search !== "" && filteredMovie.map((movie) => (
                                        <>
                                            <p className="">{movie.name}</p>
                                        </>
                                    ))}
                                </div>
                            }
                        </div>
                    </form>
                    <FaUserCircle className="text-bt-main w-10 cursor-pointer" />
                </span>

            </nav >

            <div className="p-4 bg-rose-700 ">ssd</div>


        </>
    );
}
