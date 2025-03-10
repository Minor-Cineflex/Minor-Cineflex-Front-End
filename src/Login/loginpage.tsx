import React, { useState } from "react";
import Logo from "../Logo/MinorCineflexLogo.jpg";
import { RiKey2Fill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { useNavigate, useLocation } from "react-router";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const LoginPage: React.FC = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState(String)
    const [password, setPassword] = useState(String)
    const { state } = useLocation()

    const clientID = "118402147221-rhjtqa5gmmkjktbnqq1d170plm0tcspr.apps.googleusercontent.com"

    const Login = async() => {
        try{
            const person_response = await fetch("http://localhost:8000/minorcineflex/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.toLowerCase(),
                    password: password
                })
            })
            if(!person_response.ok){
                const errorData = await person_response.json();
                alert(errorData.detail);
                return;
            }
            const user = await person_response.json()
            if (user) {
                alert("Login successful")
                if(state){
                    state.account_id = user.account.account_id
                    navigate(`/Seat/${state.cinema_id}/${state.movieName}/${state.theaterId}`, {state})
                    return
                }
                navigate(`/Profile/${user.account.username}`, {state: {account_id: user.account.account_id}})
                return
            }
        }catch(error){
            console.error("Error to Login:", error);
            alert("Failed to Login. Please try again.");
        }
    }

    const handleGoogleLoginSuccess = async(response: any) => {
        function base64UrlDecode(str) {
            str = str.replace(/-/g, '+').replace(/_/g, '/'); // Convert Base64Url to Base64
            return JSON.parse(decodeURIComponent(escape(window.atob(str))));
        }

        const credentialResponse = response.credential;
        const tokenParts = credentialResponse.split(".");
        const userData = base64UrlDecode(tokenParts[1]);
    
        const userInfo = {
            name: userData.name || "",
            tel_no: userData.phone_number || "",
            email: userData.email || "",
            birthday: userData.birthday ? new Date(userData.birthday).toISOString() : new Date().toISOString(), 
            gender: userData.gender || "", 
            account: {
                username: userData.name || "",
                password: "",
                account_id: Math.random().toString(36).substr(2, 9),
                point: 0,
                registered_date: new Date().toISOString(),
                expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
            } 
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        
        try {
            const person_list_response = await fetch(`http://localhost:8000/minorcineflex/person/${userInfo.email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if(!person_list_response.ok){
                console.log("Fail to fetch person_list")
            }
            const emailExists = await person_list_response.json()
            if(emailExists){
                alert(`Welcome back, ${emailExists.name}!`);
                if(state){
                    state.account_id = emailExists.account.account_id
                    navigate(`/Seat/${state.cinema_id}/${state.movieName}/${state.theaterId}`, { state })
                    return
                }
                navigate(`/Profile/${emailExists.account.username}`, {state: {account_id: emailExists.account.account_id}});
                return
            }

            const response = await fetch("http://localhost:8000/minorcineflex/add_person", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userInfo)
            });
            const data = await response.json();
            console.log(data.message)
            alert(`Welcome, ${userInfo.name}!`);
            if(state){
                state.account_id = userInfo.account.account_id
                navigate(`/Seat/${state.cinema_id}/${state.movieName}/${state.theaterId}`, { state })
                return
            }
            navigate(`/Profile/${userInfo.account.username}`, {state: {account_id: userInfo.account.account_id}});
            return
        }catch(error) {
            console.error("Error signing up:", error);
            alert("Failed to signing up. Please try again.");
        }
    };

    const handleCreate = () => {
        if(state){
            navigate("/Create", {state: state})
            return
        }
        navigate("/Create")
        return
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
                        <GoogleOAuthProvider clientId={clientID}>
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={() => console.log("Login Failed")}
                                text="signin_with"
                                size="large"
                                theme="outline"
                                shape="pill"
                            />
                        </GoogleOAuthProvider>
                    </div>
                    <div className="flex flex-row w-full justify-center mb-3 gap-12">
                        <nav className="text-md underline hover:text-gray-600 cursor-pointer" onClick={() => handleCreate()}>
                            Create Account
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage