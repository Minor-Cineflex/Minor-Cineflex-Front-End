import React from "react";
import Logo from "./logo/MinorCineflexLogo.jpg";

const LoginPage: React.FC = () => {
    return(
        <div className="min-h-screen bg-[#4C3A51] flex items-center justify-center">
            <div className="min-w-80 min-h-80 w-3/12 h-4/5 bg-[#D9D9D9] flex flex-col items-center justify-center">
                <img src={Logo} className="size-28"/>
                <div className="flex flex-col items-center justify-center">
                    <input type="email"/>
                    <input type="password"/>
                </div>
                <div className="flex flex-col w-full items-center justify-center">
                    <button>Login</button>
                    <p>or</p>
                    <button>Sign in with Google</button>
                    <div className="flex flex-row w-full justify-around">
                        <button>Create Account</button>
                        <button>Forget Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage