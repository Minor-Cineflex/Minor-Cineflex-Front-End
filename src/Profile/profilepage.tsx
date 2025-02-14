import React from "react";
import Logo from "./logo/MinorCineflexLogo.jpg"
import Data from "../test.json"

const testData = Data

function ShowMoviesHistory(testData){
    return(
        <div className="max-w-full max-h-full flex overflow-x-auto gap-4 custom-scrollbar pb-3">
            {testData.MinorCineflex.cinema_list[0].cinema_management.movie_list.map((movie, index) => (
                <div  key={index} 
                    className="h-80 w-56 flex-shrink-0 rounded-2xl overflow-hidden hover:border hover:border-black"
                >
                    <img 
                        className="h-full w-full object-cover cursor-pointer hover:blur-md hover:opacity-50 hover:duration-300" 
                        src={movie.pic} 
                        alt="Movie poster"
                    />
                </div>
            ))}
        </div>
    )
}

const ProfilePage: React.FC = () => {
    return(
        <div className="min-w-full min-h-screen bg-[#4C3A51] flex flex-col justify-evenly overflow-hidden">
            <div className="min-w-fit w-2/5 min-h-fit bg-[#D9D9D9] flex flex-col justify-items-center items-center self-center mt-12 gap-6 rounded-2xl">
                <img src={Logo} alt="" className="size-32"/>
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
                    {ShowMoviesHistory(testData)}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage