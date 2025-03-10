import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MinorCineflexLogo from "../MinorCineflexLogo.jpg";
import { FaUserCircle } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

export default function Headerbar({userAccountId}) {
    const [search, setSearch] = useState('');
    const [allMovie, setAllMovie] = useState([]);
    const filteredMovie = allMovie.filter((moive) =>
        moive.name.toLowerCase().includes(search.toLowerCase())
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch("http://localhost:8000/minorcineflex/movie");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                // Ensure we correctly access the movie_list array
                if (data.movie_list && Array.isArray(data.movie_list)) {
                    setAllMovie(data.movie_list);
                } else {
                    console.error("Unexpected movie data format:", data);
                }
            } catch (error) {
                console.error("Cannot fetch movie list:", error);
            }
        };
        fetchMovies();
    }, []);

    const [currentUser, setCurrentUser] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const searchUser = async () => {
            if (!userAccountId) {
                console.log("Guest");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/minorcineflex/person/email/${userAccountId}`, {
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
                setCurrentUser(person);
            } catch (error) {
                console.log("Error fetching user");
            }
        };

        searchUser();
    }, [userAccountId]);

    useEffect(() => {
        setSearch(searchQuery)
    }, [searchQuery])

    const handleNavigate = (path) => {
        if (path === "/") {
            setSearch("");
            setSearchParams({});
        }    
        if (currentUser !== null) {
            const account_id = currentUser.account.account_id
            navigate(path, { state: {
                account_id:  account_id
            }})
            return
        }
        navigate(path)
        return
    }

    const handleProfile = () => {
        if(currentUser !== null){
            const account_id = currentUser.account.account_id
            navigate(`/Profile/${currentUser.account.account_id}`, {state: {
                account_id:  account_id
            }})
            return
        }
        navigate('/Login')
        return
    }

    const showUsername = () => {
        const show_username = currentUser ? currentUser.account.username : "guest" 
        return (
            <p className="text-bt-main text-base min-w-20 max-w-20 truncate self-center">{show_username}</p>
        )
    }

    const handleSearch = (value) => {
        setSearch(value);
        setSearchParams(new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            search: value,
            ...(currentUser?.account.account_id && { account_id: currentUser.account.account_id })
        }));
    };
    
    const setSearchData = (movie) => {
        setSearch(movie.name);
        setSearchParams(new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            search: movie.name,
            ...(currentUser?.account.account_id && { account_id: currentUser.account.account_id })
        }));
    };

    return (
        <>
            <nav className="w-full p-3 md:px-16 items-center text-3xl text-bt-main place-content-between font-semibold bg-bt-sec absolute spaceb flex sm:flex-row flex-col uppercase gap-3 z-50 content-center">
                <span className="flex uppercase gap-3 content-center items-center cursor-pointer" onClick={() => handleNavigate("/")}>
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
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                required
                            />
                            {
                                filteredMovie.some(movie => movie.name === search) ? <p></p> :
                                search !== "" && filteredMovie.length > 0 &&
                                    <div className="absolute flex flex-col gap-3 text-base p-4 rounded-md mt-1 border border-bt-main  text-bt-main font-normal bg-bg-main normal-case">
                                        {search !== "" && filteredMovie.map((movie) => (
                                            <>
                                                <p className="cursor-pointer" onClick={() => setSearchData(movie)}>{movie.name}</p>
                                            </>
                                        ))}
                                    </div>
                            }
                        </div>
                    </form>
                    <div className="cursor-pointer flex flex-row gap-2" onClick={() => handleProfile()}>
                        <FaUserCircle className="text-bt-main w-full"/>
                        {showUsername()}
                    </div> 
                </span>
            </nav >
            <div className="md:p-4 pb-20 sm:p-8">ssd</div>
        </>
    );
}