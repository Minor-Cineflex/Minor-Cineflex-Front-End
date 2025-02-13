import React from "react";
import Logo from "./logo/MinorCineflexLogo.jpg"

const ProfilePage: React.FC = () => {
    return(
        <div className="min-w-full min-h-screen bg-[#4C3A51] flex flex-col">
            <div className="min-w-fit w-2/5 min-h-fit bg-[#D9D9D9] flex flex-col justify-items-center items-center self-center mt-12 gap-6 rounded-2xl">
                <img src={Logo} alt="" className="size-32"/>
                <div className="flex flex-col w-full self-start items-start gap-6 mb-12 pl-6 pr-6">
                    <h1 className="text-xl font-semibold">Username: </h1>
                    <h1 className="text-xl font-semibold">Email: </h1> 
                </div>
            </div>
        </div>
    )
}

export default ProfilePage