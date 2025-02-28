"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import Sidebar from "@/app/components/Sidebar";

const REGION = process.env.NEXT_PUBLIC_REGION;
const USER_POOL_ID = process.env.NEXT_PUBLIC_USER_POOL_ID;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

const client = new CognitoIdentityProviderClient({ region: REGION });

const Registration = () => {
    const router = useRouter();
    const [isSideBarOpen, setSideBar] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordType, setPasswordType] = useState("password"); 

    // Toggle password visibility
    const showPassword = () => {
        setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setError("ERROR: Passwords are not the same")
        } else {
            setError("");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        setError("");

        try {
            const signUpCommand = new SignUpCommand({
                ClientId: CLIENT_ID,
                Username: email,
                Password: password,
                UserAttributes: [
                    {
                        Name: "email",
                        Value: email,
                    },
                ],
            });

            const response = await client.send(signUpCommand);
            console.log("Registration success:", response);

            router.push("/pages/confirmation");
        } catch (err) {
            console.error("Registration error:", err);
            setError("Registration failed. Please try again.");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
            <div className="bg-white px-36 py-10 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                <div className="justify-center">
                    <h1 className="text-4xl text-indigo-500 text-center">Create an account</h1>
                    <h2 className="texl-3xl text-indigo-400 text-center">Required fields are marked with an asterisk (*)</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mt-5">
                            <div>
                                <label 
                                    htmlFor="email" 
                                    className="text-indigo-500"
                                >
                                    *Email:
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
                                    <label htmlFor="password" className="text-indigo-500">*Password:</label>
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
                            <div className="mt-2">
                                <label htmlFor="confirm-password" className="text-indigo-500">*Confirm Password:</label>
                                <input
                                    className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                />
                                <ul className="text-gray-500 mt-2">
                                    <li>Be at least 8 characters long</li>
                                    <li>Must inclide at least one:
                                        <ul>
                                            <li>- Lowercase letter (a-z)</li>
                                            <li>- Uppercase letter (A-Z)</li>
                                            <li>- Number (0-9)</li>
                                            <li>- Special character (!@#$%^&*() and others)</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>               
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button 
                            className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-300 text-white w-full mt-5 p-2 rounded-md"
                            type="submit" 
                            disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </form>
                    <div className="flex gap-2 justify-center text-center mt-3">
                        <p className="text-indigo-400">Already have an account?</p>
                        <p className="text-indigo-500">Login</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;