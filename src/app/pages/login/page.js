"use client"

import { useState, useContext } from "react";
import { AccountContext } from "../../components/Account";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";

// Ensure the authenticate function is available from AccountContext
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password"); 
    const [isSideBarOpen, setSideBar] = useState(false);
    const { authenticate } = useContext(AccountContext);

    // Toggle password visibility
    const showPassword = () => {
        setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
    };

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const token = await authenticate(email, password); // Authenticate and get the token
            console.log("Login successful, token:", token);
            
            // Store token in localStorage
            localStorage.setItem("token", token);

            // Redirect or take other actions after successful login
            // Example: Redirect to dashboard or home
            window.location.href = "/homepage"; // Change as per your app's flow

        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
            <div className="bg-white px-36 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                <div className="flex flex-col py-20 items-center justify-center">
                    <h1 className="text-4xl text-indigo-500 font-bold">Sign In</h1>
                    <h2 className="text-[18px] text-indigo-400 font-bold mt-2">Digital journal for tracking your moods</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mt-5">
                            <div>
                                <label
                                    className="text-indigo-500"
                                    htmlFor="email"
                                >
                                    Email:
                                </label>
                                <input
                                    className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center">
                                    <label className="text-indigo-500 mr-2" htmlFor="password">
                                        Password:
                                    </label>
                                    <div className="ml-24 flex items-center">
                                        <input
                                            className="cursor-pointer"
                                            type="checkbox"
                                            onClick={showPassword}
                                        />
                                        <span className="text-indigo-500 ml-1">Show Password</span>
                                    </div>
                                </div>
                                <input
                                    className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                                    type={passwordType}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit" 
                            className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-300 text-white font-bold w-full mt-5 p-2 rounded-md hover:bg-indigo-500 transition duration-100 ease-in-out"
                        >
                            Confirm
                        </button>
                    </form>
                    <div className="flex gap-2 text-center justify-center mt-3">
                        <p className="text-indigo-400 font-bold">Don't have an account?</p>
                        <Link href="/pages/registration">
                            <span className="text-indigo-500 font-bold">Register</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
