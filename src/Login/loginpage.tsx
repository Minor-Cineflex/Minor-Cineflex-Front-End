import React, { useState } from "react";
import Logo from "./logo/MinorCineflexLogo.jpg";
import { RiKey2Fill } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router";

const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState(String)
    const [password, setPassword] = useState(String)

    const Login = async() => {
        try{
            const person_list_response = await fetch("http://localhost:8000/minorcineflex/person", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if(!person_list_response.ok){
                console.log("Fail to fetch person_list")
            }
            const lowercase_email = email.toLocaleLowerCase()
            const person_list = await person_list_response.json()
            const user = person_list.find(p => p.email === lowercase_email);
            if (!user) {
                alert("This account does not exist")
                return
            }
            if(user.account.password !== password){
                alert("Incorrect password")
                return
            }
            alert("You can login");
        }catch(error){
            console.error("Error to Login:", error);
            alert("Failed to Login. Please try again.");
        }
    }

    return(
        <div className="min-h-screen bg-[#4C3A51] flex items-center justify-center">
            <div className="min-w-80 min-h-80 w-3/12 h-4/12 bg-[#D9D9D9] flex flex-col items-center justify-center rounded-2xl gap-3">
                <img src={Logo} alt="" className="size-32"/>
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="relative w-full">
                        <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500" size={25} />
                        <input  type="text" 
                                className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 
                                            rounded-3xl py-2 pl-12 pr-6 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                                            focus:ring-1 sm:text-xl" 
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full">
                        <RiKey2Fill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500" size={25} />
                        <input  type="password" 
                                className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 
                                            rounded-3xl py-2 pl-12 pr-6 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                                            focus:ring-1 sm:text-xl"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full items-center justify-center mt-3 gap-3">
                    <button 
                        className="p-3 pl-6 pr-6 bg-[#E7AB79] rounded-3xl text-2xl font-semibold hover:opacity-85"
                        onClick={() => Login()}
                    >
                        Login
                    </button>
                    <p className="text-xl">or</p>
                    <div className="flex items-center justify-center w-full">
                        <button className="relative flex items-center justify-center p-3 pl-12 pr-3 bg-gray-100 rounded-3xl border border-black 
                                           text-xl font-semibold w-fitcontent hover:bg-gray-200">
                            <FaGoogle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-600" size={25} />Sign in with Google
                        </button>
                    </div>
                    <div className="flex flex-row w-full justify-center mb-3 gap-12">
                        <nav className="text-md underline hover:text-gray-600 cursor-pointer" onClick={() => navigate("/Create")}>Create Account</nav>
                        <nav className="text-md underline hover:text-gray-600">Forget Password</nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage