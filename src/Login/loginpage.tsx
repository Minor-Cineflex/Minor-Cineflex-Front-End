import React from "react";
import Logo from "./logo/MinorCineflexLogo.jpg";
import { BsPersonCircle } from "react-icons/bs";
import { RiKey2Fill } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";

const LoginPage: React.FC = () => {
    return(
        <div className="min-h-screen bg-[#4C3A51] flex items-center justify-center">
            <div className="min-w-80 min-h-80 w-3/12 h-4/12 bg-[#D9D9D9] flex flex-col items-center justify-center rounded-2xl gap-3">
                <img src={Logo} alt="" className="size-32"/>
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="relative w-full">
                        <BsPersonCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500" size={25} />
                        <input type="email" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 
                                                    rounded-3xl py-2 pl-12 pr-6 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                                                    focus:ring-1 sm:text-xl" placeholder="Username"
                        />
                    </div>
                    <div className="relative w-full">
                        <RiKey2Fill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500" size={25} />
                        <input type="password" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 
                                                    rounded-3xl py-2 pl-12 pr-6 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                                                    focus:ring-1 sm:text-xl" placeholder="Password"
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full items-center justify-center mt-3 gap-3">
                    <button className="p-3 pl-6 pr-6 bg-[#E7AB79] rounded-3xl text-2xl font-semibold">Login</button>
                    <p className="text-xl">or</p>
                    <div className="flex items-center justify-center w-full">
                        <button className="relative flex items-center justify-center p-3 pl-12 pr-3 bg-transparent rounded-3xl border border-black 
                                           text-xl font-semibold w-fitcontent">
                            <FaGoogle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-600" size={25} />Sign in with Google
                        </button>
                    </div>
                    <div className="flex flex-row w-full justify-center mb-3 gap-12">
                        <button className="text-md underline">Create Account</button>
                        <button className="text-md underline">Forget Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage