import React, { useState } from "react";
import Logo from "./logo/MinorCineflexLogo.jpg"
import { MdEmail } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { RiKey2Fill } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Create:React.FC = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState(String)
    const [username, setUsername] = useState(String)
    const [password, setPassword] = useState(String)
    const [confirmPassword, setConfirmPassword] = useState(String)

    const clientID = "118402147221-rhjtqa5gmmkjktbnqq1d170plm0tcspr.apps.googleusercontent.com"

    const signUp = async() => {
        if(!email){
            alert("Please set your email")
            return
        }else if(!email.includes("@") || !email.split("@")[1].includes(".")){
            alert("Please enter a valid email address")
            return
        }else if(!username){
            alert("Please set your username")
            return
        }else if(!password){
            alert("Please set your password")
            return
        }else if(password !== confirmPassword){
            alert("Passwords don't match")
            return
        }else{
            console.log("User input data ok")
        }
        
        const userData = {
            name: "",
            tel_no: "",
            email: email.toLowerCase(),
            birthday: new Date().toISOString(),
            gender: "",
            account: {
                username: username,
                password: password,
                account_id: Math.random().toString(36).substr(2, 9),
                point: 0,
                registered_date: new Date().toISOString(),
                expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
            }
        };

        try {
            const person_list_response = await fetch("http://localhost:8000/minorcineflex/person", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if(!person_list_response.ok){
                console.log("Fail to fetch person_list")
            }
            const person_list = await person_list_response.json()
            console.log("Ok to fetched person_list", person_list);
            const emailExists = person_list.some((p: any) => p.email === email);
            if(emailExists){
                const not_have_password_person = person_list.find((p:any) => p.email === email && p.account.password === "")
                if(not_have_password_person){
                    const new_user_data = {
                        name: not_have_password_person.name,
                        tel_no: not_have_password_person.tel_no,
                        email: not_have_password_person.email,
                        birthday: not_have_password_person.birthday,
                        gender: not_have_password_person.gender,
                        account: {
                            username: username,
                            password: password,
                            account_id: not_have_password_person.account.account_id,
                            point: not_have_password_person.account.point,
                            registered_date: not_have_password_person.account.registered_date,
                            expiration_date: not_have_password_person.account.expiration_date
                        }
                    }
                    const update_password_response = await fetch("http://localhost:8000/minorcineflex/update_person", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(new_user_data)
                    });
                    const update_data = await update_password_response.json();
                    alert(update_data.message);
                    return
                }
                return alert("Already used this email")
            }
            const usernameExists = person_list.some((p: any) => p.account.username === username)
            if(usernameExists){
                return alert("This username is already in use")
            }

            const response = await fetch("http://localhost:8000/minorcineflex/add_person", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            alert(data.message);
            navigate("/Login");
        }catch(error) {
            console.error("Error signing up:", error);
            alert("Failed to create account. Please try again.");
        }
    }

    const handleGoogleLoginSuccess = async(response: any) => {
        const credentialResponse = response.credential;
        const userData = JSON.parse(atob(credentialResponse.split(".")[1]));
    
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
    
        console.log("Google Login Success:", userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
        
        try {
            const person_list_response = await fetch("http://localhost:8000/minorcineflex/person", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if(!person_list_response.ok){
                console.log("Fail to fetch person_list")
            }
            const person_list = await person_list_response.json()
            console.log("Ok to fetched person_list", person_list);
            const emailExists = person_list.some((p: any) => p.email === userInfo.email);
            if(emailExists){
                alert(`Welcome back, ${userInfo.name}!`);
                navigate("/");
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
            navigate("/");
            return
        }catch(error) {
            console.error("Error signing up:", error);
            alert("Failed to create account. Please try again.");
        }
    };

    return(
        <div className="min-h-screen bg-[#4C3A51] flex items-center justify-center">
            <div className="relative min-w-80 min-h-80 w-3/12 h-4/12 bg-[#D9D9D9] flex flex-col items-center justify-center rounded-2xl gap-3">
                <nav onClick={() => navigate("/Login")}><FaChevronLeft className="absolute top-4 left-4 cursor-pointer" size={25}/></nav>
                <img src={Logo} alt="" className="size-32"/>
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="relative w-full">
                        <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500" size={25} />
                        <input  type="email" 
                                className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 
                                            rounded-3xl py-2 pl-12 pr-6 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                                            focus:ring-1 sm:text-xl" 
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full">
                        <BsPersonCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500" size={25} />
                        <input  type="text" 
                                className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 
                                            rounded-3xl py-2 pl-12 pr-6 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                                            focus:ring-1 sm:text-xl" 
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
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
                    <div className="relative w-full">
                        <RiKey2Fill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500" size={25} />
                        <input  type="password" 
                                className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 
                                            rounded-3xl py-2 pl-12 pr-6 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
                                            focus:ring-1 sm:text-xl" 
                                placeholder="Confirm password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full items-center justify-center mt-3 gap-3">
                    <button className="p-3 pl-6 pr-6 bg-[#E7AB79] rounded-3xl text-2xl font-semibold hover:opacity-85" onClick={() => signUp()}>Sign Up</button>
                    <p className="text-xl">or</p>
                    <div className="flex items-center justify-center w-full mb-6">
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
                </div>
            </div>
        </div>
    )
}

export default Create